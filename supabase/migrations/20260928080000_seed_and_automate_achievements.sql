-- Catálogo inicial de logros y reglas de desbloqueo automático.
insert into public.achievements (slug, name, description, points, icon)
values
  ('primer-dia', 'Primer día', 'Completaste tu primer registro y comenzaste tu proceso.', 50, 'shield'),
  ('primer-check-in', 'Primer check-in', 'Registraste cómo te fue por primera vez.', 25, 'sparkles'),
  ('tres-dias-presente', 'Tres días presente', 'Completaste 3 días de seguimiento consecutivos.', 75, 'award'),
  ('una-semana-en-control', 'Una semana en control', 'Mantuviste una racha de 7 días.', 150, 'rocket'),
  ('primer-impulso-superado', 'Primer impulso superado', 'Registraste y superaste tu primer impulso.', 100, 'heart'),
  ('elegiste-diferente', 'Elegiste diferente', 'Tomaste una decisión distinta frente a un impulso.', 125, 'target'),
  ('primer-ahorro', 'Primer ahorro', 'Registraste tu primer gasto evitado.', 75, 'wallet'),
  ('dinero-recuperado', 'Dinero recuperado', 'Evitaste gastar tus primeros $50.000.', 200, 'gift'),
  ('dos-semanas-constantes', 'Dos semanas constantes', 'Completaste 14 días de seguimiento.', 300, 'sparkles'),
  ('un-mes-de-avance', 'Un mes de avance', 'Mantuviste tu proceso durante 30 días.', 600, 'rocket'),
  ('nueva-version', 'Nueva versión', 'Completaste 90 días de constancia.', 1000, 'heart'),
  ('volviste-a-elegirte', 'Volviste a elegirte', 'Registraste una recaída y retomaste tu proceso.', 100, 'flame')
on conflict (slug) do update set
  name = excluded.name,
  description = excluded.description,
  points = excluded.points,
  icon = excluded.icon;

create or replace function public.grant_achievement(p_user_id uuid, p_slug text)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_achievement_id uuid;
  v_achievement_points integer;
  inserted_count integer := 0;
  points_result jsonb;
begin
  select id, points into v_achievement_id, v_achievement_points
  from public.achievements
  where slug = p_slug;

  if v_achievement_id is null then
    return jsonb_build_object('unlocked', false, 'slug', p_slug, 'reason', 'achievement_not_found');
  end if;

  insert into public.user_achievements(user_id, achievement_id)
  values (p_user_id, v_achievement_id)
  on conflict (user_id, achievement_id) do nothing;
  get diagnostics inserted_count = row_count;

  if inserted_count = 0 then
    return jsonb_build_object('unlocked', false, 'slug', p_slug, 'achievement_id', v_achievement_id, 'reason', 'already_unlocked');
  end if;

  points_result := public.award_points('achievement_unlocked', v_achievement_id, 0, jsonb_build_object('achievement_slug', p_slug));
  return jsonb_build_object('unlocked', true, 'slug', p_slug, 'achievement_id', v_achievement_id, 'points', v_achievement_points, 'point_result', points_result);
end;
$$;

create or replace function public.evaluate_achievements(p_user_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  current_user_id uuid := auth.uid();
  latest_date date;
  cursor_date date;
  current_streak integer := 0;
  total_savings numeric := 0;
  claim jsonb;
  unlocked jsonb := '[]'::jsonb;
begin
  if current_user_id is null or p_user_id is null or current_user_id <> p_user_id then
    raise exception 'No puedes evaluar logros de otro usuario';
  end if;

  -- Primer día: el usuario ya creó al menos un hábito durante su configuración.
  if exists (select 1 from public.habits where user_id = p_user_id) then
    claim := public.grant_achievement(p_user_id, 'primer-dia');
    if (claim->>'unlocked')::boolean then unlocked := unlocked || jsonb_build_array(claim); end if;
  end if;

  -- Racha: se cuentan fechas distintas con check-in completado.
  select max(checkin_date) into latest_date
  from public.daily_checkins
  where user_id = p_user_id and status = 'completed';
  if latest_date is not null then
    cursor_date := latest_date;
    while exists (select 1 from public.daily_checkins where user_id = p_user_id and status = 'completed' and checkin_date = cursor_date) loop
      current_streak := current_streak + 1;
      cursor_date := cursor_date - 1;
    end loop;
  end if;

  if exists (select 1 from public.daily_checkins where user_id = p_user_id and status = 'completed') then
    claim := public.grant_achievement(p_user_id, 'primer-check-in');
    if (claim->>'unlocked')::boolean then unlocked := unlocked || jsonb_build_array(claim); end if;
  end if;
  if current_streak >= 3 then
    claim := public.grant_achievement(p_user_id, 'tres-dias-presente');
    if (claim->>'unlocked')::boolean then unlocked := unlocked || jsonb_build_array(claim); end if;
  end if;
  if current_streak >= 7 then
    claim := public.grant_achievement(p_user_id, 'una-semana-en-control');
    if (claim->>'unlocked')::boolean then unlocked := unlocked || jsonb_build_array(claim); end if;
  end if;
  if current_streak >= 14 then
    claim := public.grant_achievement(p_user_id, 'dos-semanas-constantes');
    if (claim->>'unlocked')::boolean then unlocked := unlocked || jsonb_build_array(claim); end if;
  end if;
  if current_streak >= 30 then
    claim := public.grant_achievement(p_user_id, 'un-mes-de-avance');
    if (claim->>'unlocked')::boolean then unlocked := unlocked || jsonb_build_array(claim); end if;
  end if;
  if current_streak >= 90 then
    claim := public.grant_achievement(p_user_id, 'nueva-version');
    if (claim->>'unlocked')::boolean then unlocked := unlocked || jsonb_build_array(claim); end if;
  end if;

  if exists (select 1 from public.craving_logs where user_id = p_user_id and outcome = 'mucho') then
    claim := public.grant_achievement(p_user_id, 'primer-impulso-superado');
    if (claim->>'unlocked')::boolean then unlocked := unlocked || jsonb_build_array(claim); end if;
  end if;
  if exists (select 1 from public.craving_logs where user_id = p_user_id and outcome in ('mucho', 'un_poco')) then
    claim := public.grant_achievement(p_user_id, 'elegiste-diferente');
    if (claim->>'unlocked')::boolean then unlocked := unlocked || jsonb_build_array(claim); end if;
  end if;

  select coalesce(sum(amount), 0) into total_savings from public.savings where user_id = p_user_id;
  if exists (select 1 from public.savings where user_id = p_user_id) then
    claim := public.grant_achievement(p_user_id, 'primer-ahorro');
    if (claim->>'unlocked')::boolean then unlocked := unlocked || jsonb_build_array(claim); end if;
  end if;
  if total_savings >= 50000 then
    claim := public.grant_achievement(p_user_id, 'dinero-recuperado');
    if (claim->>'unlocked')::boolean then unlocked := unlocked || jsonb_build_array(claim); end if;
  end if;

  if exists (
    select 1 from public.relapse_logs relapse
    where relapse.user_id = p_user_id
      and exists (
        select 1 from public.daily_checkins checkin
        where checkin.user_id = p_user_id
          and checkin.status = 'completed'
          and checkin.created_at > coalesce(relapse.occurred_at, relapse.created_at)
      )
  ) then
    claim := public.grant_achievement(p_user_id, 'volviste-a-elegirte');
    if (claim->>'unlocked')::boolean then unlocked := unlocked || jsonb_build_array(claim); end if;
  end if;

  return unlocked;
end;
$$;

create or replace function public.evaluate_my_achievements()
returns jsonb
language sql
security definer
set search_path = public
as $$
  select public.evaluate_achievements(auth.uid());
$$;

create or replace function public.trigger_evaluate_achievements()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  perform public.evaluate_achievements(new.user_id);
  return new;
end;
$$;

drop trigger if exists evaluate_achievements_after_habit on public.habits;
create trigger evaluate_achievements_after_habit after insert or update on public.habits
for each row execute function public.trigger_evaluate_achievements();

drop trigger if exists evaluate_achievements_after_checkin on public.daily_checkins;
create trigger evaluate_achievements_after_checkin after insert or update on public.daily_checkins
for each row execute function public.trigger_evaluate_achievements();

drop trigger if exists evaluate_achievements_after_craving on public.craving_logs;
create trigger evaluate_achievements_after_craving after insert or update on public.craving_logs
for each row execute function public.trigger_evaluate_achievements();

drop trigger if exists evaluate_achievements_after_saving on public.savings;
create trigger evaluate_achievements_after_saving after insert or update on public.savings
for each row execute function public.trigger_evaluate_achievements();

drop trigger if exists evaluate_achievements_after_relapse on public.relapse_logs;
create trigger evaluate_achievements_after_relapse after insert or update on public.relapse_logs
for each row execute function public.trigger_evaluate_achievements();

grant execute on function public.evaluate_my_achievements() to authenticated;
