create extension if not exists "pgcrypto";

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null default '',
  avatar_url text,
  points integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create table if not exists public.habits (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references public.profiles(id) on delete cascade,
  name text not null, habit_type text, goal_type text, frequency text, cost_amount numeric(12,2) default 0, cost_frequency text, active boolean not null default true, created_at timestamptz not null default now()
);
create table if not exists public.habit_goals (
  id uuid primary key default gen_random_uuid(), habit_id uuid not null references public.habits(id) on delete cascade, target_days integer not null default 7, reason text, status text not null default 'active', created_at timestamptz not null default now()
);
create table if not exists public.daily_checkins (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references public.profiles(id) on delete cascade, habit_id uuid references public.habits(id) on delete set null, checkin_date date not null default current_date, status text not null default 'completed', mood integer, note text, created_at timestamptz not null default now(), unique(user_id, checkin_date, habit_id)
);
create table if not exists public.craving_logs (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references public.profiles(id) on delete cascade, habit_id uuid references public.habits(id) on delete set null, intensity integer not null check (intensity between 1 and 10), trigger text, outcome text, duration_minutes integer default 10, created_at timestamptz not null default now()
);
create table if not exists public.relapse_logs (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references public.profiles(id) on delete cascade, habit_id uuid references public.habits(id) on delete set null, note text, occurred_at timestamptz not null default now(), created_at timestamptz not null default now()
);
create table if not exists public.achievements (
  id uuid primary key default gen_random_uuid(), slug text unique not null, name text not null, description text not null, points integer not null default 0
);
create table if not exists public.user_achievements (
  user_id uuid not null references public.profiles(id) on delete cascade, achievement_id uuid not null references public.achievements(id) on delete cascade, unlocked_at timestamptz not null default now(), primary key(user_id, achievement_id)
);
create table if not exists public.rewards (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references public.profiles(id) on delete cascade, name text not null, description text, points_cost integer not null default 0, money_cost numeric(12,2), image_url text, is_redeemed boolean not null default false, created_at timestamptz not null default now()
);
create table if not exists public.user_rewards (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references public.profiles(id) on delete cascade, reward_id uuid not null references public.rewards(id) on delete cascade, redeemed_at timestamptz not null default now()
);
create table if not exists public.savings (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references public.profiles(id) on delete cascade, amount numeric(12,2) not null, category text default 'avoided_spend', note text, saved_at date not null default current_date, created_at timestamptz not null default now()
);
create table if not exists public.notification_preferences (
  user_id uuid primary key references public.profiles(id) on delete cascade, weekly_summary boolean not null default true, monthly_summary boolean not null default true, checkin_reminders boolean not null default true, achievements boolean not null default true, goals boolean not null default true, frequency text not null default 'weekly', reminder_day text default 'monday', reminder_time time default '20:00', timezone text default 'America/Bogota', updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.habits enable row level security;
alter table public.habit_goals enable row level security;
alter table public.daily_checkins enable row level security;
alter table public.craving_logs enable row level security;
alter table public.relapse_logs enable row level security;
alter table public.user_achievements enable row level security;
alter table public.rewards enable row level security;
alter table public.user_rewards enable row level security;
alter table public.savings enable row level security;
alter table public.notification_preferences enable row level security;

create or replace function public.is_owner(owner_id uuid) returns boolean language sql stable as $$ select auth.uid() = owner_id $$;
drop policy if exists "profiles owner" on public.profiles;
drop policy if exists "habits owner" on public.habits;
drop policy if exists "goals owner" on public.habit_goals;
drop policy if exists "checkins owner" on public.daily_checkins;
drop policy if exists "cravings owner" on public.craving_logs;
drop policy if exists "relapses owner" on public.relapse_logs;
drop policy if exists "achievements owner" on public.user_achievements;
drop policy if exists "rewards owner" on public.rewards;
drop policy if exists "user rewards owner" on public.user_rewards;
drop policy if exists "savings owner" on public.savings;
drop policy if exists "notifications owner" on public.notification_preferences;

create policy "profiles owner" on public.profiles for all using (id = auth.uid()) with check (id = auth.uid());
create policy "habits owner" on public.habits for all using (is_owner(user_id)) with check (is_owner(user_id));
create policy "goals owner" on public.habit_goals for all using (exists(select 1 from public.habits h where h.id = habit_id and is_owner(h.user_id))) with check (exists(select 1 from public.habits h where h.id = habit_id and is_owner(h.user_id)));
create policy "checkins owner" on public.daily_checkins for all using (is_owner(user_id)) with check (is_owner(user_id));
create policy "cravings owner" on public.craving_logs for all using (is_owner(user_id)) with check (is_owner(user_id));
create policy "relapses owner" on public.relapse_logs for all using (is_owner(user_id)) with check (is_owner(user_id));
create policy "achievements owner" on public.user_achievements for all using (is_owner(user_id)) with check (is_owner(user_id));
create policy "rewards owner" on public.rewards for all using (is_owner(user_id)) with check (is_owner(user_id));
create policy "user rewards owner" on public.user_rewards for all using (is_owner(user_id)) with check (is_owner(user_id));
create policy "savings owner" on public.savings for all using (is_owner(user_id)) with check (is_owner(user_id));
create policy "notifications owner" on public.notification_preferences for all using (is_owner(user_id)) with check (is_owner(user_id));

create or replace function public.handle_new_user() returns trigger language plpgsql security definer set search_path = public as $$
begin insert into public.profiles (id, full_name) values (new.id, coalesce(new.raw_user_meta_data->>'full_name', '')); return new; end; $$;
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users for each row execute procedure public.handle_new_user();
