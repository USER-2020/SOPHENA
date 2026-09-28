create table if not exists public.point_transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  action_key text not null,
  source_id uuid not null,
  points integer not null,
  amount numeric(12,2),
  description text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique(user_id, action_key, source_id)
);

alter table public.point_transactions enable row level security;
drop policy if exists "point transactions owner read" on public.point_transactions;
create policy "point transactions owner read" on public.point_transactions for select using (public.is_owner(user_id));

insert into public.app_settings (setting_key, value, description)
values (
  'point_rules',
  '{"version":1,"rules":[
    {"action_key":"checkin_completed","points":10,"enabled":true,"calculation":"fixed"},
    {"action_key":"craving_overcome","points":15,"enabled":true,"calculation":"fixed"},
    {"action_key":"craving_reduced","points":8,"enabled":true,"calculation":"fixed"},
    {"action_key":"saving_registered","points":5,"enabled":true,"calculation":"fixed"},
    {"action_key":"saving_bonus","points":1,"amount_unit":10000,"enabled":true,"calculation":"per_amount"},
    {"action_key":"achievement_unlocked","points":0,"enabled":true,"calculation":"achievement"}
  ]}'::jsonb,
  'Reglas de conversión de acciones a XP'
)
on conflict (setting_key) do nothing;

create or replace function public.award_points(
  p_action_key text,
  p_source_id uuid,
  p_amount numeric default 0,
  p_metadata jsonb default '{}'::jsonb
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  current_user_id uuid := auth.uid();
  rule jsonb;
  awarded integer := 0;
  amount_unit numeric := 0;
  source_amount numeric := coalesce(p_amount, 0);
  source_description text := p_action_key;
  inserted_id uuid;
begin
  if current_user_id is null then raise exception 'Sesión no iniciada'; end if;
  if p_source_id is null then raise exception 'La acción necesita un origen'; end if;

  select item into rule
  from jsonb_array_elements(coalesce((select value->'rules' from public.app_settings where setting_key = 'point_rules'), '[]'::jsonb)) item
  where item->>'action_key' = p_action_key
  limit 1;

  if rule is null or coalesce((rule->>'enabled')::boolean, false) = false then
    return jsonb_build_object('awarded', false, 'points', 0, 'reason', 'rule_disabled');
  end if;

  if p_action_key = 'checkin_completed' then
    if not exists (select 1 from public.daily_checkins where id = p_source_id and user_id = current_user_id and status = 'completed') then
      return jsonb_build_object('awarded', false, 'points', 0, 'reason', 'invalid_checkin');
    end if;
    awarded := greatest(0, coalesce((rule->>'points')::integer, 0));
    source_description := 'Check-in completado';
  elsif p_action_key in ('craving_overcome', 'craving_reduced') then
    if not exists (
      select 1 from public.craving_logs
      where id = p_source_id and user_id = current_user_id
        and ((p_action_key = 'craving_overcome' and outcome = 'mucho') or (p_action_key = 'craving_reduced' and outcome = 'un_poco'))
    ) then
      return jsonb_build_object('awarded', false, 'points', 0, 'reason', 'invalid_craving');
    end if;
    awarded := greatest(0, coalesce((rule->>'points')::integer, 0));
    source_description := case when p_action_key = 'craving_overcome' then 'Impulso superado' else 'Impulso reducido' end;
  elsif p_action_key in ('saving_registered', 'saving_bonus') then
    select amount into source_amount from public.savings where id = p_source_id and user_id = current_user_id;
    if not found then return jsonb_build_object('awarded', false, 'points', 0, 'reason', 'invalid_saving'); end if;
    if p_action_key = 'saving_registered' then
      awarded := greatest(0, coalesce((rule->>'points')::integer, 0));
      source_description := 'Gasto evitado registrado';
    else
      amount_unit := greatest(1, coalesce((rule->>'amount_unit')::numeric, 10000));
      awarded := greatest(0, floor(source_amount / amount_unit)::integer * coalesce((rule->>'points')::integer, 0));
      source_description := 'Bono por ahorro';
    end if;
  elsif p_action_key = 'achievement_unlocked' then
    if not exists (select 1 from public.user_achievements where user_id = current_user_id and achievement_id = p_source_id) then
      return jsonb_build_object('awarded', false, 'points', 0, 'reason', 'achievement_not_unlocked');
    end if;
    select points, name into awarded, source_description from public.achievements where id = p_source_id;
    awarded := greatest(0, coalesce(awarded, 0));
  else
    return jsonb_build_object('awarded', false, 'points', 0, 'reason', 'unsupported_action');
  end if;

  if awarded = 0 then return jsonb_build_object('awarded', false, 'points', 0, 'reason', 'zero_points'); end if;

  begin
    insert into public.point_transactions(user_id, action_key, source_id, points, amount, description, metadata)
    values (current_user_id, p_action_key, p_source_id, awarded, source_amount, source_description, coalesce(p_metadata, '{}'::jsonb))
    returning id into inserted_id;
  exception when unique_violation then
    return jsonb_build_object('awarded', false, 'points', 0, 'reason', 'already_awarded');
  end;

  update public.profiles set points = coalesce(points, 0) + awarded, updated_at = now() where id = current_user_id;
  return jsonb_build_object('awarded', true, 'points', awarded, 'transaction_id', inserted_id);
end;
$$;

create or replace function public.unlock_achievement(p_achievement_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  current_user_id uuid := auth.uid();
  unlocked boolean := false;
  inserted_count integer := 0;
  points_result jsonb;
begin
  if current_user_id is null then raise exception 'Sesión no iniciada'; end if;
  insert into public.user_achievements(user_id, achievement_id)
  values (current_user_id, p_achievement_id)
  on conflict (user_id, achievement_id) do nothing;
  get diagnostics inserted_count = row_count;
  unlocked := inserted_count > 0;
  if unlocked then points_result := public.award_points('achievement_unlocked', p_achievement_id, 0, '{}'::jsonb); else points_result := jsonb_build_object('awarded', false, 'points', 0, 'reason', 'already_unlocked'); end if;
  return jsonb_build_object('unlocked', unlocked, 'points', points_result);
end;
$$;

grant execute on function public.award_points(text, uuid, numeric, jsonb) to authenticated;
grant execute on function public.unlock_achievement(uuid) to authenticated;
