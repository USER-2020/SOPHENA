create table if not exists public.user_notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  notification_type text not null default 'system',
  title text not null,
  body text not null,
  action_path text,
  source_type text,
  source_id uuid,
  created_at timestamptz not null default now(),
  read_at timestamptz
);

create index if not exists user_notifications_user_created_idx
  on public.user_notifications(user_id, created_at desc);

create unique index if not exists user_notifications_source_idx
  on public.user_notifications(user_id, source_type, source_id)
  where source_id is not null;

alter table public.user_notifications enable row level security;

drop policy if exists "user notifications owner" on public.user_notifications;
create policy "user notifications owner"
  on public.user_notifications for all
  using (public.is_owner(user_id))
  with check (public.is_owner(user_id));

create or replace function public.notify_feed_post()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.published and new.published_at <= now()
    and (
      tg_op = 'INSERT'
      or old.published is distinct from true
      or old.published_at > now()
    ) then
    insert into public.user_notifications (
      user_id,
      notification_type,
      title,
      body,
      action_path,
      source_type,
      source_id
    )
    select
      profile.id,
      'feed',
      new.title,
      coalesce(nullif(new.excerpt, ''), nullif(new.content, ''), 'Hay una nueva novedad en SOPHENA.'),
      '/feed',
      'feed_post',
      new.id
    from public.profiles profile
    where (
      new.audience_type = 'all'
      or (
        new.audience_type = 'users'
        and coalesce(new.audience_value->'user_ids', '[]'::jsonb) ? profile.id::text
      )
      or (
        new.audience_type = 'roles'
        and coalesce(new.audience_value->'roles', '[]'::jsonb) ? coalesce(profile.role, 'user')
      )
    )
    on conflict do nothing;
  end if;
  return new;
end;
$$;

drop trigger if exists notify_feed_post_after_publish on public.app_feed_posts;
create trigger notify_feed_post_after_publish
  after insert or update on public.app_feed_posts
  for each row execute function public.notify_feed_post();
