alter table public.profiles add column if not exists email text;

update public.profiles p
set email = u.email
from auth.users u
where u.id = p.id and (p.email is null or p.email = '');

create table if not exists public.app_roles (
  role_key text primary key,
  name text not null,
  description text,
  is_system boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.app_permissions (
  permission_key text primary key,
  name text not null,
  description text,
  created_at timestamptz not null default now()
);

create table if not exists public.role_permissions (
  role_key text not null references public.app_roles(role_key) on delete cascade,
  permission_key text not null references public.app_permissions(permission_key) on delete cascade,
  created_at timestamptz not null default now(),
  primary key(role_key, permission_key)
);

alter table public.app_roles enable row level security;
alter table public.app_permissions enable row level security;
alter table public.role_permissions enable row level security;

drop policy if exists "roles admin only" on public.app_roles;
drop policy if exists "permissions admin only" on public.app_permissions;
drop policy if exists "role permissions admin only" on public.role_permissions;
create policy "roles admin only" on public.app_roles for all using (public.is_super_admin()) with check (public.is_super_admin());
create policy "permissions admin only" on public.app_permissions for all using (public.is_super_admin()) with check (public.is_super_admin());
create policy "role permissions admin only" on public.role_permissions for all using (public.is_super_admin()) with check (public.is_super_admin());

insert into public.app_roles(role_key, name, description, is_system) values
  ('super_admin', 'Super admin', 'Control total de la plataforma.', true),
  ('admin', 'Administrador', 'Gestiona contenido y usuarios autorizados.', true),
  ('moderator', 'Moderador', 'Modera contenido y comunidad.', true),
  ('support', 'Soporte', 'Consulta usuarios y ayuda con incidencias.', true),
  ('user', 'Usuario', 'Acceso a la experiencia personal.', true)
on conflict (role_key) do nothing;

insert into public.app_permissions(permission_key, name, description) values
  ('users.read', 'Ver usuarios', 'Consultar la lista de usuarios registrados.'),
  ('users.invite', 'Invitar usuarios', 'Crear usuarios mediante invitación por correo.'),
  ('users.roles', 'Asignar roles', 'Cambiar el rol de una cuenta.'),
  ('achievements.manage', 'Gestionar logros', 'Crear, editar y eliminar logros.'),
  ('modules.manage', 'Gestionar módulos', 'Crear y configurar módulos.'),
  ('points.manage', 'Gestionar puntos', 'Configurar reglas de conversión a XP.'),
  ('themes.manage', 'Gestionar temas', 'Modificar temas y colores.'),
  ('feed.manage', 'Gestionar feed', 'Publicar novedades y enlaces.'),
  ('settings.manage', 'Gestionar ajustes', 'Editar configuraciones globales.')
on conflict (permission_key) do nothing;

insert into public.role_permissions(role_key, permission_key)
select 'super_admin', permission_key from public.app_permissions
on conflict do nothing;

create or replace function public.handle_new_user() returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'full_name', ''))
  on conflict (id) do update set email = excluded.email;
  return new;
end;
$$;

create or replace function public.list_admin_users()
returns table(id uuid, email text, full_name text, role text, points integer, created_at timestamptz)
language plpgsql security definer set search_path = public
as $$
begin
  if not public.is_super_admin() then raise exception 'Acceso restringido'; end if;
  return query
    select p.id, coalesce(p.email, u.email), p.full_name, p.role, p.points, p.created_at
    from public.profiles p
    left join auth.users u on u.id = p.id
    order by p.created_at desc;
end;
$$;

create or replace function public.admin_update_user_role(p_user_id uuid, p_role_key text)
returns public.profiles
language plpgsql security definer set search_path = public
as $$
declare updated_profile public.profiles;
begin
  if not public.is_super_admin() then raise exception 'Acceso restringido'; end if;
  if not exists(select 1 from public.app_roles where role_key = p_role_key) then raise exception 'Rol no válido'; end if;
  if p_user_id = auth.uid() and p_role_key <> 'super_admin' then raise exception 'No puedes quitarte tu propio acceso de superadmin'; end if;
  update public.profiles set role = p_role_key, updated_at = now() where id = p_user_id returning * into updated_profile;
  return updated_profile;
end;
$$;

grant execute on function public.list_admin_users() to authenticated;
grant execute on function public.admin_update_user_role(uuid, text) to authenticated;
