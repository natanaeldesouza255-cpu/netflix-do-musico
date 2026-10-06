-- Additive migration. Legacy tables and browser data are not deleted or imported.
create schema if not exists ndm_private;
revoke all on schema ndm_private from public;
grant usage on schema ndm_private to anon, authenticated;

create table public.ndm_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  version integer not null default 1,
  role text not null default 'student' check (role in ('student','admin')),
  status text not null default 'active' check (status in ('active','inactive')),
  subscription_status text not null default 'pending' check (subscription_status in ('active','pending','overdue','cancelled')),
  data jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
create table public.ndm_settings (
  id text primary key check(id='main'),
  data jsonb not null,
  version integer not null default 1
);
insert into public.ndm_settings values ('main', '{"platformName":"Netflix do Músico","tagline":"Aprenda música no seu ritmo","supportEmail":"","planName":"Premium Mensal","planPrice":47.9,"maintenanceMode":false,"allowRegistrations":true,"adminMenu":[{"id":"dashboard","label":"Dashboard","screen":"AdminDashboard","visible":true,"order":0},{"id":"courses","label":"Cursos","screen":"AdminCourses","visible":true,"order":1},{"id":"content","label":"Conteúdo","screen":"AdminModulesLessons","visible":true,"order":2},{"id":"students","label":"Alunos","screen":"AdminStudents","visible":true,"order":3},{"id":"finance","label":"Financeiro","screen":"AdminFinance","visible":true,"order":4},{"id":"lives","label":"Lives","screen":"AdminLives","visible":true,"order":5},{"id":"community","label":"Comunidade","screen":"AdminCommunity","visible":true,"order":6},{"id":"marketplace","label":"Marketplace","screen":"AdminMarketplace","visible":false,"order":7},{"id":"equipment","label":"Equipamentos","screen":"AdminEquipment","visible":true,"order":8},{"id":"settings","label":"Configurações","screen":"AdminSettings","visible":true,"order":9}]}', 1);
-- Preserve settings already saved by PR #3, when present.
do $$ declare legacy jsonb; begin
  if to_regclass('public.platform_settings') is not null then
    execute 'select to_jsonb(s) from public.platform_settings s where id = ''main''' into legacy;
    if legacy is not null then
      update public.ndm_settings set data = data || jsonb_strip_nulls(jsonb_build_object(
        'platformName',legacy->'platform_name','tagline',legacy->'tagline',
        'supportEmail',legacy->'support_email','planName',legacy->'plan_name',
        'planPrice',legacy->'plan_price','maintenanceMode',legacy->'maintenance_mode',
        'allowRegistrations',legacy->'allow_registrations','adminMenu',legacy->'admin_menu'));
    end if;
  end if;
end $$;

create function ndm_private.is_admin() returns boolean language sql stable security definer set search_path='' as $$
 select exists(select 1 from public.ndm_profiles where id=auth.uid() and role='admin' and status='active');
$$;
create function ndm_private.is_member() returns boolean language sql stable security definer set search_path='' as $$
 select exists(select 1 from public.ndm_profiles where id=auth.uid() and status='active' and subscription_status='active')
 and not coalesce((select (data->>'maintenanceMode')::boolean from public.ndm_settings where id='main'),true);
$$;
create function ndm_private.feature_enabled(feature text) returns boolean language sql stable security definer set search_path='' as $$
 select not exists(select 1 from public.ndm_settings s, jsonb_array_elements(s.data->'adminMenu') item
 where item->>'id'=feature and item->>'visible'='false');
$$;

create table public.ndm_records (
  kind text not null check(kind in ('course','module','lesson','live','marketplace','equipment','post','payment','activity')),
  id text not null,
  data jsonb not null check(jsonb_typeof(data)='object'),
  version integer not null default 1,
  author_id uuid references auth.users(id) on delete set null,
  parent_kind text,
  parent_id text,
  primary key(kind,id),
  foreign key(parent_kind,parent_id) references public.ndm_records(kind,id) on delete cascade,
  check ((kind='module' and parent_kind='course' and parent_id is not null) or
         (kind='lesson' and parent_kind='module' and parent_id is not null) or
         (kind not in ('module','lesson') and parent_kind is null and parent_id is null))
);
create index ndm_records_parent on public.ndm_records(parent_kind,parent_id);
create function ndm_private.can_read_record(k text, d jsonb) returns boolean language plpgsql stable security definer set search_path='' as $$
declare c jsonb; m jsonb; begin
 if ndm_private.is_admin() then return true; end if;
 if coalesce((select (data->>'maintenanceMode')::boolean from public.ndm_settings where id='main'),true) then return false; end if;
 if k='course' then return d->>'status'='published'; end if;
 if k in ('module','lesson') then
   select data into c from public.ndm_records where kind='course' and id=d->>'courseId';
   if c is null or c->>'status'<>'published' then return false; end if;
   if k='module' then return true; end if;
   select data into m from public.ndm_records where kind='module' and id=d->>'moduleId';
   return m is not null and m->>'courseId'=d->>'courseId' and d->>'status'='published'
     and (d->>'isFree'='true' or ndm_private.is_member());
 end if;
 if not ndm_private.is_member() then return false; end if;
 return case k
   when 'equipment' then d->>'published'='true' and ndm_private.feature_enabled('equipment')
   when 'post' then d->>'moderationStatus' in ('visible','reported') and ndm_private.feature_enabled('community')
   when 'live' then d->>'status' in ('scheduled','live','finished','replay') and ndm_private.feature_enabled('lives')
   when 'marketplace' then d->>'status'='active' and ndm_private.feature_enabled('marketplace')
   else false end;
end $$;

create function ndm_private.prepare_record() returns trigger language plpgsql security definer set search_path='' as $$
declare m jsonb; p public.ndm_profiles; begin
 new.data := new.data || jsonb_build_object('id',new.id);
 if new.kind='module' then new.parent_kind:='course'; new.parent_id:=new.data->>'courseId';
 elsif new.kind='lesson' then
   new.parent_kind:='module'; new.parent_id:=new.data->>'moduleId';
   select data into m from public.ndm_records where kind='module' and id=new.parent_id;
   if m is null or m->>'courseId' is distinct from new.data->>'courseId' then raise exception 'Módulo não pertence ao curso'; end if;
 else new.parent_kind:=null; new.parent_id:=null; end if;
 if new.kind='post' and coalesce(new.data->>'videoUrl','')<>'' and not (new.data->>'videoUrl' ~ '^https://(www\.)?(youtube(-nocookie)?\.com/embed/[A-Za-z0-9_-]+|player\.vimeo\.com/video/[0-9]+)(\?[^[:space:]#]*)?$') then
   raise exception 'Use um link de incorporação HTTPS do YouTube ou Vimeo';
 end if;
 if new.kind='post' and tg_op='INSERT' and not ndm_private.is_admin() then
   select * into p from public.ndm_profiles where id=auth.uid();
   new.author_id:=auth.uid();
   new.data:=jsonb_build_object('id',new.id,'authorId',p.id,'authorName',coalesce(p.data->>'name','Aluno'),
     'authorInstrument',coalesce(p.data->>'instrument',''),'authorLevel',coalesce(p.data->>'level','Nível Zero'),
     'authorAvatar',coalesce(p.data->>'avatar',''),'content',left(new.data->>'content',5000),
     'videoUrl',new.data->>'videoUrl','date',now(),'likes',0,'comments','[]'::jsonb,'reports',0,'moderationStatus','visible');
 end if;
 return new;
end $$;
create trigger ndm_prepare_record before insert or update on public.ndm_records for each row execute function ndm_private.prepare_record();

create table public.ndm_progress (
 user_id uuid primary key references auth.users(id) on delete cascade,
 data jsonb not null default '{}'::jsonb,
 version integer not null default 1
);
create table public.ndm_interactions (
 id uuid primary key default gen_random_uuid(),
 record_kind text not null,
 record_id text not null,
 author_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
 action text not null check(action in ('like','report','comment','review')),
 data jsonb not null default '{}'::jsonb,
 created_at timestamptz not null default now(),
 foreign key(record_kind,record_id) references public.ndm_records(kind,id) on delete cascade,
 check ((record_kind='post' and action in ('like','report','comment')) or (record_kind='equipment' and action='review')),
 check (action not in ('comment','review') or (length(data->>'text') between 1 and 5000)),
 check (action<>'review' or ((data->>'rating')::numeric between 1 and 5))
);
create unique index ndm_one_vote on public.ndm_interactions(record_kind,record_id,author_id,action) where action in ('like','report');
create index ndm_interactions_record on public.ndm_interactions(record_kind,record_id);

alter table public.ndm_profiles enable row level security;
alter table public.ndm_records enable row level security;
alter table public.ndm_settings enable row level security;
alter table public.ndm_progress enable row level security;
alter table public.ndm_interactions enable row level security;
create policy profile_read on public.ndm_profiles for select to authenticated using(id=auth.uid() or ndm_private.is_admin());
create policy profile_admin on public.ndm_profiles for update to authenticated using(ndm_private.is_admin()) with check(ndm_private.is_admin());
create policy settings_read on public.ndm_settings for select to anon, authenticated using(true);
create policy settings_admin on public.ndm_settings for update to authenticated using(ndm_private.is_admin()) with check(ndm_private.is_admin());
create policy record_read on public.ndm_records for select to anon, authenticated using(ndm_private.can_read_record(kind,data));
create policy record_admin on public.ndm_records for all to authenticated using(ndm_private.is_admin()) with check(ndm_private.is_admin());
create policy post_create on public.ndm_records for insert to authenticated with check(kind='post' and author_id=auth.uid() and ndm_private.is_member() and ndm_private.feature_enabled('community') and data->>'moderationStatus'='visible');
create policy progress_read on public.ndm_progress for select to authenticated using(user_id=auth.uid() or ndm_private.is_admin());
create policy progress_write on public.ndm_progress for all to authenticated using(user_id=auth.uid() and ndm_private.is_member()) with check(user_id=auth.uid() and ndm_private.is_member());
create policy interaction_read on public.ndm_interactions for select to authenticated using(exists(select 1 from public.ndm_records r where r.kind=record_kind and r.id=record_id) and (ndm_private.is_member() or ndm_private.is_admin()));
create policy interaction_create on public.ndm_interactions for insert to authenticated with check(author_id=auth.uid() and ndm_private.is_member() and exists(select 1 from public.ndm_records r where r.kind=record_kind and r.id=record_id));
grant select on public.ndm_records,public.ndm_settings to anon;
grant select,insert,update,delete on public.ndm_records to authenticated;
grant select,update on public.ndm_settings to authenticated;
grant select on public.ndm_profiles to authenticated;
grant update(status,subscription_status,data,version) on public.ndm_profiles to authenticated;
grant select,insert,update on public.ndm_progress to authenticated;
grant select,insert on public.ndm_interactions to authenticated;

-- An admin transaction is atomic and rejects outdated browser revisions.
create function public.ndm_commit_records(changes jsonb) returns void language plpgsql security invoker set search_path='' as $$
declare ch jsonb; affected integer; begin
 if not ndm_private.is_admin() then raise exception 'Acesso administrativo restrito'; end if;
 for ch in select * from jsonb_array_elements(changes) loop
   if ch->>'op'='delete' then
     delete from public.ndm_records where kind=ch->>'kind' and id=ch->>'id' and version=(ch->>'version')::integer;
   elsif (ch->>'version')::integer=0 then
     insert into public.ndm_records(kind,id,data) values(ch->>'kind',ch->>'id',ch->'data');
   else
     update public.ndm_records set data=ch->'data',version=version+1
     where kind=ch->>'kind' and id=ch->>'id' and version=(ch->>'version')::integer;
   end if;
   get diagnostics affected=row_count;
   if affected<>1 then raise exception 'Conteúdo alterado em outra sessão. Atualize e tente novamente.'; end if;
 end loop;
end $$;
revoke all on function public.ndm_commit_records(jsonb) from public,anon;
grant execute on function public.ndm_commit_records(jsonb) to authenticated;

create function public.ndm_update_profile(changes jsonb) returns void language plpgsql security invoker set search_path='' as $$
begin
 -- Self-service is deliberately performed by the narrowly scoped helper below.
 perform ndm_private.update_own_profile(changes);
end $$;
create function ndm_private.update_own_profile(changes jsonb) returns void language plpgsql security definer set search_path='' as $$
begin
 if auth.uid() is null then raise exception 'Login necessário'; end if;
 update public.ndm_profiles set version=version+1,data=data || jsonb_strip_nulls(jsonb_build_object(
 'name',left(changes->>'name',120),'bio',left(changes->>'bio',1000),'instrument',left(changes->>'instrument',100),
 'avatar',left(changes->>'avatar',2048),'level',left(changes->>'level',80))) where id=auth.uid() and status='active';
 if not found then raise exception 'Conta indisponível'; end if;
end $$;
revoke all on function public.ndm_update_profile(jsonb) from public,anon;
grant execute on function public.ndm_update_profile(jsonb) to authenticated;

create function ndm_private.create_profile() returns trigger language plpgsql security definer set search_path='' as $$
begin
 if coalesce((select (data->>'allowRegistrations')::boolean from public.ndm_settings where id='main'),false)=false then
   raise exception 'Novos cadastros temporariamente desativados';
 end if;
 insert into public.ndm_profiles(id,email,data) values(new.id,coalesce(new.email,''),jsonb_build_object(
   'name',left(coalesce(new.raw_user_meta_data->>'name','Aluno'),120),
   'instrument',left(coalesce(new.raw_user_meta_data->>'instrument',''),100))) on conflict do nothing;
 return new;
end $$;
create trigger ndm_create_profile after insert on auth.users for each row execute function ndm_private.create_profile();
-- Existing accounts remain pending unless a trusted server-side admin role already exists.
insert into public.ndm_profiles(id,email,role,subscription_status,data)
select id,coalesce(email,''),case when raw_app_meta_data->>'role'='admin' then 'admin' else 'student' end,
 case when raw_app_meta_data->>'role'='admin' then 'active' else 'pending' end,
 jsonb_build_object('name',left(coalesce(raw_user_meta_data->>'name','Aluno'),120),'instrument',left(coalesce(raw_user_meta_data->>'instrument',''),100)) from auth.users on conflict do nothing;

revoke all on all functions in schema ndm_private from public,anon,authenticated;
grant execute on function ndm_private.is_admin(),ndm_private.is_member(),ndm_private.feature_enabled(text),ndm_private.can_read_record(text,jsonb) to anon,authenticated;
grant execute on function ndm_private.update_own_profile(jsonb) to authenticated;
