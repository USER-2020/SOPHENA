alter table public.app_modules add column if not exists audience_type text not null default 'all';
alter table public.app_modules add column if not exists audience_value jsonb not null default '{}'::jsonb;

create table if not exists public.app_themes (
  id uuid primary key default gen_random_uuid(),
  theme_key text unique not null,
  name text not null,
  config jsonb not null default '{}'::jsonb,
  enabled boolean not null default true,
  is_active boolean not null default false,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.app_feed_posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  excerpt text,
  content text,
  url text,
  image_url text,
  category text not null default 'Novedad',
  published boolean not null default true,
  published_at timestamptz not null default now(),
  audience_type text not null default 'all',
  audience_value jsonb not null default '{}'::jsonb,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.app_themes enable row level security;
alter table public.app_feed_posts enable row level security;

create or replace function public.audience_matches(target_type text, target_value jsonb)
returns boolean language plpgsql stable security definer set search_path = public
as $$
declare current_role text;
begin
  if target_type = 'all' then return true; end if;
  if auth.uid() is null then return false; end if;
  if target_type = 'users' then return coalesce(target_value->'user_ids', '[]'::jsonb) ? auth.uid()::text; end if;
  if target_type = 'roles' then
    select role into current_role from public.profiles where id = auth.uid();
    return coalesce(target_value->'roles', '[]'::jsonb) ? coalesce(current_role, 'user');
  end if;
  return false;
end;
$$;

drop policy if exists "modules public read" on public.app_modules;
create policy "modules public read" on public.app_modules for select using ((enabled = true and public.audience_matches(audience_type, audience_value)) or public.is_super_admin());

drop policy if exists "themes public read" on public.app_themes;
drop policy if exists "themes admin write" on public.app_themes;
create policy "themes public read" on public.app_themes for select using (enabled = true);
create policy "themes admin write" on public.app_themes for all using (public.is_super_admin()) with check (public.is_super_admin());

drop policy if exists "feed public read" on public.app_feed_posts;
drop policy if exists "feed admin write" on public.app_feed_posts;
create policy "feed public read" on public.app_feed_posts for select using ((published = true and published_at <= now() and public.audience_matches(audience_type, audience_value)) or public.is_super_admin());
create policy "feed admin write" on public.app_feed_posts for all using (public.is_super_admin()) with check (public.is_super_admin());

insert into public.app_themes (theme_key, name, config, enabled, is_active)
values ('sophena-default', 'SOPHENA', '{"bg":"#0D0B12","surface":"#15121C","card":"#211C2C","purple":"#A78BFA","green":"#75D6C4","amber":"#F3C677","danger":"#E17C8C"}'::jsonb, true, true)
on conflict (theme_key) do nothing;
