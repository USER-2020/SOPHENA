---
name: sophena-role-documentation
description: "Mantiene la documentación de SOPHENA por rol: historias de usuario, permisos, rutas, estados de implementación y guías rápidas con mockups textuales. Úsalo al actualizar docs, UX flows, consola de superadmin o materiales para otros agentes."
---

# Documentación por roles de SOPHENA

Usa este skill cuando una tarea pida documentar o rediseñar historias de usuario, permisos, flujos por rol, guías rápidas, mockups de documentación o la consola de administración de SOPHENA.

## Fuente de verdad

Antes de escribir, contrasta siempre la implementación actual en este orden:

1. `supabase/migrations/*` para roles, permisos, RLS y restricciones reales.
2. `src/services/api.js` para operaciones disponibles y sus fallbacks.
3. `src/main.jsx` para rutas, guards, navegación y pantallas que realmente existen.
4. `references/role-matrix.md` y `references/quick-guide-mockups.md` de este skill.
5. `docs/ROLE_USER_STORIES.md` y `docs/QUICK_GUIDES_BY_ROLE.md` como documentación publicada.

No presentes como disponible una capacidad que solo aparezca en una maqueta, en una migración sin pantalla o en una idea de producto. Marca explícitamente cada elemento como `Implementado`, `Parcial` o `Catalogado / pendiente`.

## Flujo de trabajo

1. Identifica el rol, la persona usuaria, el objetivo y la acción principal.
2. Verifica la ruta, el servicio, la tabla/RPC y la protección de acceso.
3. Escribe la historia con formato: “Como [rol], quiero [acción], para [resultado]”.
4. Añade criterios de aceptación verificables, estados vacío/error/carga y restricciones de seguridad.
5. Actualiza la matriz de rol y la guía rápida correspondiente.
6. Incluye un mockup textual pequeño para explicar jerarquía, acciones y navegación. No lo uses para inventar controles que la UI no tiene.
7. Enlaza la nueva documentación desde `docs/UX_FLOWS.md` o `docs/SOPHENA_PRODUCT.md` cuando corresponda.
8. Valida enlaces, rutas, nombres de permisos y estado de implementación antes de terminar.

## Reglas de documentación

- `super_admin` es el único rol con control total sembrado actualmente.
- `admin`, `moderator`, `support` y `user` existen en el catálogo de datos, pero no deben documentarse como consolas activas si la UI/guard todavía no las habilita.
- La seguridad efectiva vive en Supabase/RLS/RPC; una guía nunca debe afirmar que ocultar un botón es protección suficiente.
- Conserva las rutas actuales (`/app/*`, `/feed`, `/feed/:postId`, `/super-admin/*`) y los nombres reales de permisos.
- Documenta audiencias de módulos/feed (`all`, `roles`, `users`) y sus efectos sin asumir que un usuario puede editar su propia audiencia.
- Mantén las guías mobile-first, accesibles y coherentes con el sistema visual de Sophena. Los mockups deben ser de baja fidelidad y centrarse en flujo, no en decorar.

## Entregables esperados

Para una actualización completa, modifica solo lo necesario en:

- `docs/ROLE_USER_STORIES.md`
- `docs/QUICK_GUIDES_BY_ROLE.md`
- `docs/SEO_SOCIAL_SHARING.md`
- `docs/UX_FLOWS.md` o `docs/SOPHENA_PRODUCT.md`
- `references/role-matrix.md`
- `references/quick-guide-mockups.md`

Si la petición cambia la UI, consulta antes `.agents/skills/apple-product-ui-ux/SKILL.md` y conserva la lógica, la API, la autenticación y la base de datos existentes.
