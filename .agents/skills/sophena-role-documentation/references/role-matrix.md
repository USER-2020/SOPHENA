# Matriz actual de roles y permisos

Esta matriz refleja el estado observado en `20260928060000_admin_users_roles.sql`, `src/services/api.js` y `src/main.jsx`. Si el código cambia, actualiza esta referencia antes de ampliar las guías.

## Roles

| Rol | Descripción actual | Estado de UI |
| --- | --- | --- |
| `super_admin` | Control total de la plataforma. | Implementado en `/super-admin/*`; guard explícito por rol y sesión administrativa. |
| `admin` | Gestiona contenido y usuarios autorizados. | Catalogado; no hay consola propia habilitada por el guard actual. |
| `moderator` | Modera contenido y comunidad. | Catalogado; no hay consola propia habilitada por el guard actual. |
| `support` | Consulta usuarios y ayuda con incidencias. | Catalogado; no hay consola propia habilitada por el guard actual. |
| `user` | Acceso a la experiencia personal. | Implementado en `/app/*`, `/feed` y `/feed/:postId`. |

## Permisos de administración

| Clave | Capacidad | Pantalla principal |
| --- | --- | --- |
| `users.read` | Consultar usuarios registrados. | `/super-admin/users` |
| `users.invite` | Invitar usuarios por correo. | `/super-admin/users` |
| `users.roles` | Cambiar el rol de una cuenta. | `/super-admin/users`, `/super-admin/roles` |
| `achievements.manage` | Crear, editar y eliminar logros. | `/super-admin/achievements` |
| `modules.manage` | Crear, editar, ordenar y activar módulos. | `/super-admin/modules` |
| `points.manage` | Configurar reglas de XP/puntos. | `/super-admin/points` |
| `themes.manage` | Crear, activar y eliminar temas. | `/super-admin/themes` |
| `feed.manage` | Publicar y gestionar novedades. | `/super-admin/feed` |
| `settings.manage` | Editar ajustes globales. | `/super-admin/settings` |

La migración siembra todos los permisos para `super_admin`. Las asignaciones de otros roles se administran desde la consola y no deben darse por hechas sin verificar la base de datos.

## Límites de seguridad

- `is_super_admin()` protege las tablas de roles, permisos y asignaciones.
- `admin_update_user_role` solo permite cambios a un superadmin y evita que se quite a sí mismo ese rol.
- El frontend puede ocultar navegación, pero no reemplaza RLS/RPC.
- La experiencia del usuario conserva sus datos privados; las audiencias de módulos/feed deben respetar la configuración almacenada.

## Rutas y datos

| Área | Ruta | Servicio/entidad |
| --- | --- | --- |
| Experiencia personal | `/app/*` | `dataApi.modules`, registros de actividad, puntos y notificaciones. |
| Feed público/autenticado | `/feed`, `/feed/:postId` | `dataApi.feedService`, publicaciones y audiencia. |
| Consola superadmin | `/super-admin/*` | `dataApi.adminService`, perfiles, roles y módulos. |
| Documentación de usuario | `/app/documentation` | Guía privada del usuario. |
| Documentación administrativa | `/super-admin/documentation` | Guía privada de configuración de la plataforma. |

