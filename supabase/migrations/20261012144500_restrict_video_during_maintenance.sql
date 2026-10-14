-- During maintenance, deny new storage reads by students even if subscribed.
-- Admin access remains available. Previously issued signed URLs may remain valid until expiry.
drop policy if exists "ndm_video_member_read" on storage.objects;
create policy "ndm_video_member_read" on storage.objects
for select to authenticated
using (
 bucket_id = 'ndm-lesson-videos'
 and exists (
   select 1 from public.ndm_profiles p
   where p.id = (select auth.uid())
   and p.status = 'active'
   and (
     p.role = 'admin'
     or (
       p.role = 'student'
       and p.subscription_status = 'active'
       and exists (
         select 1 from public.ndm_settings s
         where s.id = 'main'
         and coalesce((s.data ->> 'maintenanceMode')::boolean, false) = false
       )
     )
   )
 )
);
