-- Permite que cada logro tenga una identidad visual configurable desde el panel.
alter table public.achievements
  add column if not exists icon text not null default 'trophy';

alter table public.achievements
  drop constraint if exists achievements_icon_check;

alter table public.achievements
  add constraint achievements_icon_check
  check (icon in ('trophy', 'flame', 'sparkles', 'target', 'heart', 'rocket', 'shield', 'award', 'zap', 'gift', 'wallet'));
