-- Admin operations require a session verified with TOTP (AAL2).
-- Supabase RLS policies already call ndm_private.is_admin().
create or replace function ndm_private.is_admin()
returns boolean
language sql
stable security definer
set search_path = ''
as $$
  select (select auth.jwt() ->> 'aal') = 'aal2'
    and exists (
      select 1 from public.ndm_profiles
      where id = auth.uid() and role = 'admin' and status = 'active'
    );
$$;
