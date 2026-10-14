-- Best-effort capture from Supabase Auth's own audit table.
-- Stores action and audit ID only; no IPs, passwords, tokens, or raw payloads.
create or replace function ndm_private.capture_auth_events()
returns trigger language plpgsql security definer set search_path='' as $$
declare v_action text;
begin
 v_action:=lower(coalesce(new.payload->>'action',''));
 if v_action ~ '^[a-z_]{3,55}$' then
  insert into public.ndm_security_events(event_type,severity,outcome,source,details,occurred_at)
  values ('auth.'||v_action,
  case when v_action ~ '(fail|error|delete)' then 'warning' else 'info' end,
  case when v_action ~ '(fail|error)' then 'denied' else 'success' end,
  'auth',jsonb_build_object('audit_id',new.id),new.created_at);
 end if;
 return new;
exception when others then return new;
end $$;
drop trigger if exists ndm_capture_auth_events on auth.audit_log_entries;
create trigger ndm_capture_auth_events after insert on auth.audit_log_entries
for each row execute function ndm_private.capture_auth_events();
revoke all on function ndm_private.capture_auth_events() from public,anon,authenticated;
