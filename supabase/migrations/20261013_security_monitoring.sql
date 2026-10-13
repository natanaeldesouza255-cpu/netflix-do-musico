-- Security event logging: applied to Supabase production 2026-10-13.
-- Do not record credentials, bearer tokens, raw request bodies, or unnecessary PII.
create table if not exists public.ndm_security_events (
 id bigint generated always as identity primary key,
 occurred_at timestamptz not null default now(),
 event_type text not null check (length(event_type) between 3 and 80 and event_type ~ '^[a-z][a-z0-9_.-]+$'),
 severity text not null default 'info' check (severity in ('info','warning','critical')),
 outcome text not null default 'success' check (outcome in ('success','denied','error')),
 actor_id uuid, subject_id uuid,
 request_id text check (request_id is null or (length(request_id)<=100 and request_id !~ '[[:cntrl:]]')),
 source text not null default 'database' check (source in ('database','auth','edge')),
 details jsonb not null default '{}'::jsonb check (jsonb_typeof(details)='object' and pg_column_size(details)<=4096)
);
alter table public.ndm_security_events enable row level security;
revoke all on public.ndm_security_events from anon,authenticated;
revoke all on sequence public.ndm_security_events_id_seq from anon,authenticated;
create index if not exists ndm_security_events_time_idx on public.ndm_security_events(occurred_at desc);
create index if not exists ndm_security_events_type_time_idx on public.ndm_security_events(event_type,occurred_at desc);
create index if not exists ndm_security_events_actor_time_idx on public.ndm_security_events(actor_id,occurred_at desc);
create or replace function ndm_private.mirror_security_audit_event()
returns trigger language plpgsql security definer set search_path='' as $$
begin
 insert into public.ndm_security_events(event_type,severity,outcome,actor_id,subject_id,source,details,occurred_at)
 values ('profile.security_changed','warning','success',new.actor_id,new.subject_id,'database',
 jsonb_build_object('audit_id',new.id,'old_role',new.old_values->>'role','new_role',new.new_values->>'role',
 'old_status',new.old_values->>'status','new_status',new.new_values->>'status',
 'old_subscription',new.old_values->>'subscription_status','new_subscription',new.new_values->>'subscription_status'),new.occurred_at);
 return new;
end $$;
drop trigger if exists ndm_mirror_security_audit_event on public.ndm_security_audit;
create trigger ndm_mirror_security_audit_event after insert on public.ndm_security_audit
for each row execute function ndm_private.mirror_security_audit_event();
revoke all on function ndm_private.mirror_security_audit_event() from public,anon,authenticated;
create or replace view ndm_private.security_alerts as
select date_trunc('hour',occurred_at) as window_start,event_type,actor_id,count(*) as event_count,
 case when count(*) >= 10 then 'critical' else 'warning' end as alert_level
from public.ndm_security_events
where occurred_at >= now()-interval '24 hours' and (outcome in ('denied','error') or severity in ('warning','critical'))
group by 1,2,3 having count(*) >= 5
union all
select date_trunc('hour',occurred_at),event_type,actor_id,count(*),'critical'
from public.ndm_security_events
where occurred_at >= now()-interval '24 hours' and event_type='profile.security_changed' and details->>'new_role'='admin'
group by 1,2,3;
revoke all on ndm_private.security_alerts from public,anon,authenticated;
