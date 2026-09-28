alter table public.profiles add column if not exists role text not null default 'user';

create table if not exists public.app_modules (
  id uuid primary key default gen_random_uuid(),
  module_key text unique not null,
  name text not null,
  description text,
  route text,
  icon text,
  enabled boolean not null default true,
  sort_order integer not null default 0,
  config jsonb not null default '{}'::jsonb,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.app_settings (
  setting_key text primary key,
  value jsonb not null default '{}'::jsonb,
  description text,
  updated_by uuid references public.profiles(id) on delete set null,
  updated_at timestamptz not null default now()
);

alter table public.achievements enable row level security;
alter table public.app_modules enable row level security;
alter table public.app_settings enable row level security;

create or replace function public.is_super_admin()
returns boolean language sql stable security definer set search_path = public
as $$ select exists(select 1 from public.profiles where id = auth.uid() and role = 'super_admin') $$;

drop policy if exists "achievements public read" on public.achievements;
drop policy if exists "achievements admin write" on public.achievements;
create policy "achievements public read" on public.achievements for select using (true);
create policy "achievements admin write" on public.achievements for all using (is_super_admin()) with check (is_super_admin());

drop policy if exists "modules public read" on public.app_modules;
drop policy if exists "modules admin write" on public.app_modules;
create policy "modules public read" on public.app_modules for select using (enabled = true or is_super_admin());
create policy "modules admin write" on public.app_modules for all using (is_super_admin()) with check (is_super_admin());

drop policy if exists "settings admin only" on public.app_settings;
create policy "settings admin only" on public.app_settings for all using (is_super_admin()) with check (is_super_admin());

insert into public.app_modules (module_key, name, description, route, icon, sort_order)
values
  ('home', 'Inicio', 'Resumen de progreso y racha', '/app', 'home', 10),
  ('progress', 'Progreso', 'Calendario, tendencias e insights', '/app/progress', 'chart', 20),
  ('rewards', 'Retos y recompensas', 'Logros y metas personales', '/app/rewards', 'trophy', 30)
on conflict (module_key) do nothing;
