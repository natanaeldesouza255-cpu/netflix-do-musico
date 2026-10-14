-- Require MFA for privileged video storage operations, consistent with table RLS.
alter policy ndm_video_admin_delete on storage.objects
using (bucket_id = 'ndm-lesson-videos' and ndm_private.is_admin());
alter policy ndm_video_admin_insert on storage.objects
with check (bucket_id = 'ndm-lesson-videos' and ndm_private.is_admin());
alter policy ndm_video_member_read on storage.objects
using (
  bucket_id = 'ndm-lesson-videos'
  and (
    ndm_private.is_admin()
    or (
      exists (select 1 from public.ndm_profiles p where p.id = (select auth.uid())
        and p.role='student' and p.status='active' and p.subscription_status='active')
      and exists (select 1 from public.ndm_settings s where s.id='main'
        and coalesce((s.data->>'maintenanceMode')::boolean,false)=false)
    )
  )
);
