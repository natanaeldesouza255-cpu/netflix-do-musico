-- Manual retention procedure. Schedule only after a tested backup and approved policy.
create or replace function ndm_private.prune_security_events(p_days integer default 90)
returns integer language plpgsql security definer set search_path='' as $$
declare v_count integer;
begin
 if p_days < 30 or p_days > 365 then raise exception 'invalid retention'; end if;
 delete from public.ndm_security_events where occurred_at < now() - make_interval(days=>p_days);
 get diagnostics v_count = row_count;
 return v_count;
end $$;
revoke all on function ndm_private.prune_security_events(integer) from public,anon,authenticated;
