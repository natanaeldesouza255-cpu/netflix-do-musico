-- Private lesson videos: only admins upload; admins and active subscribers can request signed URLs.
insert into storage.buckets (id,name,public,file_size_limit,allowed_mime_types)
values ('ndm-lesson-videos','ndm-lesson-videos',false,47185920,array['video/mp4'])
on conflict (id) do update set public=false,file_size_limit=47185920,allowed_mime_types=array['video/mp4'];

create policy "ndm_video_admin_insert" on storage.objects for insert to authenticated
with check (bucket_id='ndm-lesson-videos' and exists (
  select 1 from public.ndm_profiles p where p.id=(select auth.uid()) and p.role='admin' and p.status='active'
));
create policy "ndm_video_member_read" on storage.objects for select to authenticated
using (bucket_id='ndm-lesson-videos' and exists (
  select 1 from public.ndm_profiles p where p.id=(select auth.uid()) and p.status='active'
  and (p.role='admin' or (p.role='student' and p.subscription_status='active'))
));
create policy "ndm_video_admin_delete" on storage.objects for delete to authenticated
using (bucket_id='ndm-lesson-videos' and exists (
  select 1 from public.ndm_profiles p where p.id=(select auth.uid()) and p.role='admin' and p.status='active'
));
