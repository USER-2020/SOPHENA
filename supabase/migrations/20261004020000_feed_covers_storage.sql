-- Public cover images for feed articles. The article row keeps the resulting
-- public URL in app_feed_posts.image_url so existing feed and SEO flows remain compatible.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'feed-covers',
  'feed-covers',
  true,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update
set public = excluded.public,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "feed covers public read" on storage.objects;
drop policy if exists "feed covers superadmin insert" on storage.objects;
drop policy if exists "feed covers superadmin update" on storage.objects;
drop policy if exists "feed covers superadmin delete" on storage.objects;

create policy "feed covers public read"
on storage.objects for select
using (bucket_id = 'feed-covers');

create policy "feed covers superadmin insert"
on storage.objects for insert
with check (bucket_id = 'feed-covers' and public.is_super_admin());

create policy "feed covers superadmin update"
on storage.objects for update
using (bucket_id = 'feed-covers' and public.is_super_admin())
with check (bucket_id = 'feed-covers' and public.is_super_admin());

create policy "feed covers superadmin delete"
on storage.objects for delete
using (bucket_id = 'feed-covers' and public.is_super_admin());
