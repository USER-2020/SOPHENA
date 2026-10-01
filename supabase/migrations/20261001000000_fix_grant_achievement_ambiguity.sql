-- Evita la ambigüedad entre variables PL/pgSQL y columnas de user_achievements.
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
