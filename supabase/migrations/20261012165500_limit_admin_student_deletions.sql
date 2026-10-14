create table if not exists ndm_private.admin_rate_limits (
 actor_id uuid not null,
 operation text not null,
 window_start timestamptz not null,
 attempts integer not null default 0,
 primary key (actor_id, operation)
);
revoke all on ndm_private.admin_rate_limits from public, anon, authenticated;
create or replace function public.ndm_check_admin_rate_limit(p_actor uuid,p_operation text,p_max integer default 5,p_window_seconds integer default 900)
returns boolean language plpgsql security definer set search_path = ''
as $$
declare v_attempts integer;
begin
 if p_actor is null or p_operation <> 'delete_student' or p_max <> 5 or p_window_seconds <> 900 then return false; end if;
 insert into ndm_private.admin_rate_limits(actor_id,operation,window_start,attempts)
 values(p_actor,p_operation,now(),1)
 on conflict(actor_id,operation) do update set
 attempts=case when ndm_private.admin_rate_limits.window_start <= now()-interval '15 minutes' then 1 else ndm_private.admin_rate_limits.attempts+1 end,
 window_start=case when ndm_private.admin_rate_limits.window_start <= now()-interval '15 minutes' then now() else ndm_private.admin_rate_limits.window_start end
 returning attempts into v_attempts;
 return v_attempts<=5;
end $$;
revoke all on function public.ndm_check_admin_rate_limit(uuid,text,integer,integer) from public,anon,authenticated;
grant execute on function public.ndm_check_admin_rate_limit(uuid,text,integer,integer) to service_role;
