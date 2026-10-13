-- Records denied admin requests from the existing atomic rate limiter.
create or replace function ndm_private.audit_admin_rate_limit()
returns trigger language plpgsql security definer set search_path='' as $$
begin
 if new.attempts > 5 and (tg_op='INSERT' or old.attempts <= 5 or new.attempts % 5 = 0) then
  insert into public.ndm_security_events(event_type,severity,outcome,actor_id,source,details)
  values ('admin.rate_limit_exceeded','warning','denied',new.actor_id,'database',
   jsonb_build_object('operation',new.operation,'attempts',new.attempts,'window_start',new.window_start));
 end if;
 return new;
end $$;
drop trigger if exists ndm_audit_admin_rate_limit on ndm_private.admin_rate_limits;
create trigger ndm_audit_admin_rate_limit after insert or update on ndm_private.admin_rate_limits
for each row execute function ndm_private.audit_admin_rate_limit();
revoke all on function ndm_private.audit_admin_rate_limit() from public,anon,authenticated;
