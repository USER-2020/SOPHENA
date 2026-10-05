# Historias de usuario por rol

Esta es la referencia funcional de las capacidades actuales de SOPHENA. Está alineada con las migraciones de Supabase, `dataApi` y las rutas del frontend. Las capacidades marcadas como `Catalogado / pendiente` no deben mostrarse como disponibles en una guía operativa.

## Convenciones

- **Implementado:** existe ruta, UI y operación conectada o fallback local equivalente.
- **Parcial:** existe parte del flujo, pero falta una pantalla, una asignación o una integración para considerarlo completo.
- **Catalogado / pendiente:** existe en el modelo de roles o permisos, pero la UI actual no habilita el flujo de forma independiente.

## Usuario (`user`) — Implementado

### US-U01 — Acceder a mi espacio

**Como** usuario, **quiero** registrarme, iniciar sesión y completar la bienvenida, **para** entrar a mi espacio personal.

**Criterios de aceptación**

- El usuario puede iniciar sesión y es dirigido a `/app`.
- Si el onboarding está incompleto, se muestra el flujo correspondiente antes de la experiencia principal.
- Una cuenta sin rol administrativo no puede entrar a `/super-admin/*`.

### US-U02 — Registrar mi progreso diario

**Como** usuario, **quiero** registrar un check-in y otras señales de mi proceso, **para** observar mis patrones sin juicio.

**Criterios de aceptación**

- La acción está disponible desde el dashboard y respeta estados de carga, vacío y error.
- El registro actualiza el resumen, el progreso y los puntos cuando corresponda.
- Los datos quedan asociados al usuario autenticado y no se presentan como públicos.

### US-U03 — Consultar progreso, metas y puntos

**Como** usuario, **quiero** consultar mi progreso, metas, racha y recompensas, **para** decidir mi siguiente paso.

**Criterios de aceptación**

- La navegación de módulos se filtra por módulos habilitados y audiencia.
- La pantalla explica el estado actual, el próximo objetivo y las acciones disponibles.
- Si no hay datos, se muestra un estado vacío útil y una acción para comenzar.

### US-U04 — Gestionar notificaciones

**Como** usuario, **quiero** configurar mis preferencias y ver el contador de novedades, **para** recibir señales relevantes.

**Criterios de aceptación**

- La campana abre el apartado de notificaciones.
- El contador representa notificaciones no leídas del usuario.
- Las novedades publicadas para la audiencia correspondiente pueden generar una notificación y la suscripción en tiempo real actualiza la interfaz cuando está disponible.

### US-U05 — Leer novedades

**Como** usuario, **quiero** ver una lista resumida de novedades y abrir el detalle, **para** decidir qué información leer.

**Criterios de aceptación**

- Las publicaciones aparecen como filas/cards de feed, con título y resumen truncado.
- “Leer” navega a `/feed/:postId`.
- El detalle interpreta el contenido enriquecido de manera segura y conserva enlaces válidos.
- El detalle ofrece compartir nativo y enlaces directos para WhatsApp, LinkedIn y X.
- La página de detalle actualiza título, canonical, Open Graph, Twitter Cards y datos estructurados `Article`.
- La publicación solo aparece si su audiencia incluye al usuario.

## Superadmin (`super_admin`) — Implementado

### US-SA01 — Administrar usuarios y roles

**Como** superadmin, **quiero** consultar usuarios, invitar cuentas y cambiar roles, **para** controlar el acceso de la plataforma.

**Criterios de aceptación**

- El flujo vive en `/super-admin/users` y `/super-admin/roles`.
- Las operaciones requieren sesión administrativa y validación del rol en backend.
- No es posible auto-degradar la cuenta superadmin mediante el RPC protegido.

### US-SA02 — Configurar permisos por rol

**Como** superadmin, **quiero** activar o desactivar permisos para un rol, **para** definir sus capacidades.

**Criterios de aceptación**

- Se puede seleccionar un rol y modificar sus permisos desde `/super-admin/roles`.
- Los nombres usados son los permisos reales de Supabase (`users.read`, `feed.manage`, etc.).
- El cambio se persiste mediante `adminService`; ocultar un control no se considera autorización.

### US-SA03 — Administrar módulos y audiencias

**Como** superadmin, **quiero** crear, ordenar, activar y dirigir módulos, **para** configurar la experiencia por audiencia.

**Criterios de aceptación**

- La configuración está disponible en `/super-admin/modules`.
- La audiencia puede ser `all`, `roles` o `users`.
- La navegación del usuario solo muestra módulos habilitados cuyo path sea válido y cuya audiencia coincida.

### US-SA04 — Gestionar logros, puntos y temas

**Como** superadmin, **quiero** configurar logros, reglas de XP/puntos y temas, **para** ajustar el producto sin cambiar código.

**Criterios de aceptación**

- Las áreas son `/super-admin/achievements`, `/super-admin/points` y `/super-admin/themes`.
- Los controles muestran estados activo/inactivo de forma accesible y guardan explícitamente los cambios.
- Un fallo de persistencia se comunica sin presentar el cambio como exitoso.

### US-SA05 — Publicar novedades segmentadas

**Como** superadmin, **quiero** redactar contenido enriquecido y elegir su audiencia, **para** comunicar actualizaciones relevantes.

**Criterios de aceptación**

- El flujo está en `/super-admin/feed` y usa `feed.manage`.
- El editor admite título, resumen, portada opcional, contenido enriquecido, enlace, categoría, audiencia y estado de publicación.
- La portada se selecciona desde un input de archivo, se valida como JPG/PNG/WebP de hasta 5 MB y se sube al bucket público `feed-covers`; la URL resultante se guarda en `app_feed_posts.image_url`.
- El superadmin puede alternar entre edición y vista previa, con conteo de palabras y tiempo estimado de lectura.
- La vista pública resume el contenido, oculta el exceso con ellipsis y abre un detalle independiente.

### US-SA06 — Consultar guías de administración

**Como** superadmin, **quiero** consultar documentación contextual, **para** entender el propósito y el efecto de cada módulo.

**Criterios de aceptación**

- La documentación está disponible en `/super-admin/documentation`.
- Cada guía indica propósito, acción principal, estado vacío y consecuencia del cambio.
- La guía diferencia configuración de producto y autorización de seguridad.

## Roles catalogados

### Administrador (`admin`) — Catalogado / pendiente

Gestiona contenido y usuarios autorizados. El catálogo existe en `app_roles`, pero el guard actual de la consola solo admite `super_admin`; no hay que documentar una ruta `/admin` como si estuviera operativa.

### Moderador (`moderator`) — Catalogado / pendiente

Modera contenido y comunidad. Falta definir su ruta, permisos efectivos, alcance de feed y pantalla de revisión.

### Soporte (`support`) — Catalogado / pendiente

Consulta usuarios y ayuda con incidencias. Falta definir acceso de solo lectura, datos visibles, auditoría y ruta de soporte.

## Invariantes de seguridad

- Las tablas de roles, permisos y asignaciones están restringidas por RLS a superadmin.
- La autorización efectiva debe mantenerse en Supabase/RPC; el cliente solo refleja el estado permitido.
- Las guías no deben incluir tokens, secretos ni credenciales.
- Cualquier futura historia de `admin`, `moderator` o `support` debe actualizar primero migraciones, guards, rutas y pruebas.
