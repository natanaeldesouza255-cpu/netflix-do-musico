-- Supabase projects may inherit ALL table privileges for API roles.
-- Remove those defaults from existing application tables before granting the minimum.
revoke all on public.ndm_profiles, public.ndm_settings, public.ndm_records,
  public.ndm_progress, public.ndm_interactions from public, anon, authenticated;
grant select on public.ndm_records, public.ndm_settings to anon;
grant select,insert,update,delete on public.ndm_records to authenticated;
grant select,update on public.ndm_settings to authenticated;
grant select on public.ndm_profiles to authenticated;
grant update(status,subscription_status,data,version) on public.ndm_profiles to authenticated;
grant select,insert,update on public.ndm_progress to authenticated;
grant select,insert on public.ndm_interactions to authenticated;

-- Legacy tables remain available without retaining the earlier unrestricted writes.
do $$ begin
 if to_regclass('public.courses') is not null then
   alter table public.courses enable row level security;
   revoke all on public.courses from public,anon,authenticated;
   grant select on public.courses to anon,authenticated;
   grant insert,update,delete on public.courses to authenticated;
   create policy ndm_legacy_course_read on public.courses for select to anon,authenticated
     using(visible is true or ndm_private.is_admin());
   create policy ndm_legacy_course_admin on public.courses for all to authenticated
     using(ndm_private.is_admin()) with check(ndm_private.is_admin());
 end if;
 if to_regclass('public.profiles') is not null then
   revoke all on public.profiles from public,anon,authenticated;
 end if;
 if to_regclass('public.platform_settings') is not null then
   revoke all on public.platform_settings from public,anon,authenticated;
   grant select on public.platform_settings to anon,authenticated;
   grant insert,update on public.platform_settings to authenticated;
   drop policy if exists "platform settings authenticated update" on public.platform_settings;
   drop policy if exists "platform settings authenticated write" on public.platform_settings;
   create policy ndm_legacy_settings_insert on public.platform_settings for insert to authenticated
     with check(ndm_private.is_admin());
   create policy ndm_legacy_settings_update on public.platform_settings for update to authenticated
     using(ndm_private.is_admin()) with check(ndm_private.is_admin());
 end if;
end $$;
