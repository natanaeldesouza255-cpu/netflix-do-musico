create or replace function public.ndm_record_auth_event(p_event text)
returns void language plpgsql security definer set search_path='' as $$
declare v_actor uuid := auth.uid();
begin
 if v_actor is null or p_event not in ('login_success','logout','mfa_verified') then
  raise exception 'unauthorized';
 end if;
 insert into public.ndm_security_events(event_type,severity,outcome,actor_id,source)
 values ('auth.'||p_event,'info','success',v_actor,'auth');
end $$;
revoke all on function public.ndm_record_auth_event(text) from public,anon;
grant execute on function public.ndm_record_auth_event(text) to authenticated;
