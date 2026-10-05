# Guías rápidas por rol

Guía de referencia corta para producto, soporte y agentes de desarrollo. Los mockups son esquemas de flujo, no capturas pixel-perfect.

## Usuario

```text
Entrada → Onboarding → Dashboard
                         ├─ Registrar check-in
                         ├─ Ver progreso / metas / puntos
                         ├─ Campana → Notificaciones
                         └─ Novedades → Leer → Detalle
```

### Pasos

1. Inicia sesión y completa la bienvenida si aparece.
2. En **Inicio**, revisa racha, próximo objetivo y resumen.
3. Usa la acción principal para registrar cómo te fue hoy.
4. Consulta **Progreso**, **Metas**, **Perfil** o **Novedades** desde la navegación disponible.
5. Abre la campana para revisar preferencias y notificaciones no leídas.
6. En Novedades, selecciona **Leer** para abrir `/feed/:postId`.
7. Desde el detalle, usa **Compartir** o elige WhatsApp, LinkedIn o X.

### Mockup

```text
┌──────────────────────────────────────────────────────────────┐
│ SOPHENA                           🔔 [contador]   Perfil      │
├──────────────────────────────────────────────────────────────┤
│ TU ESPACIO PERSONAL                                          │
│ Hola, [nombre]                                               │
│ ┌───────────────────────────────────────────────────────────┐ │
│ │ Racha actual   [días]       Próximo objetivo       →      │ │
│ └───────────────────────────────────────────────────────────┘ │
│                 [ + Registrar ]                               │
├──────────────────────────────────────────────────────────────┤
│ Inicio   Progreso   Metas   Perfil   Novedades               │
└──────────────────────────────────────────────────────────────┘
```

## Superadmin

### Pasos

1. Entra a `/super-admin/*` con una cuenta cuyo `profiles.role` sea `super_admin`.
2. Usa el selector de módulo para elegir usuarios, roles, módulos, logros, puntos, temas, feed, documentación o ajustes.
3. En **Feed**, redacta el título, resumen y contenido; usa formato de artículo, sube una portada opcional desde tu equipo y añade enlaces de apoyo.
4. Para la portada, selecciona JPG, PNG o WebP de máximo 5 MB. El sistema la guarda en el bucket `feed-covers` y muestra la vista previa antes de publicar.
4. Alterna entre **Editar** y **Vista previa** para revisar la lectura antes de publicar.
5. Revisa el alcance de la audiencia antes de guardar.
6. Confirma el resultado de la operación; ante error, conserva los datos del formulario y reintenta después de revisar permisos/conectividad.
7. Para cambios de autorización, valida también la migración/RLS/RPC, no solo la apariencia del botón.

### Mockup de navegación

```text
┌───────────────┬──────────────────────────────────────────────┐
│ SOPHENA       │ Módulo actual                 ES ◉ EN  👤     │
│ SUPER ADMIN   ├──────────────────────────────────────────────┤
│ Resumen       │ Contenido principal                          │
│ Logros        │ [estado] [acción primaria]                    │
│ Módulos       │ ┌────────────────┐ ┌────────────────────────┐ │
│ Temas         │ │ selector       │ │ configuración          │ │
│ Feed          │ │ de entidad     │ │ permisos/audiencia    │ │
│ Puntos        │ └────────────────┘ └────────────────────────┘ │
│ Usuarios      │                                              │
│ Roles         │ [Guardar] [Cancelar]                         │
│ Documentación│                                              │
│ Ajustes       │                                              │
└───────────────┴──────────────────────────────────────────────┘
```

## Novedades y feed

```text
Crear → Validar título/resumen/contenido → Elegir audiencia → Publicar
                                                                  ↓
Lista: [categoría] Título resumido…                         Leer →
                                                                  ↓
Detalle: título + contenido enriquecido seguro + enlace + volver
```

La lista debe priorizar lectura rápida: filas apiladas en móvil, contenido truncado, foco visible y acción **Leer** clara. El detalle no debe cargar HTML sin sanitización y debe conservar un enlace canónico compartible.

## Roles catalogados sin guía operativa todavía

| Rol | Qué puede afirmarse hoy | Qué falta antes de una guía de uso |
| --- | --- | --- |
| `admin` | Existe en el catálogo con propósito de gestionar contenido y usuarios autorizados. | Guard, rutas, permisos sembrados, pantallas y criterios de auditoría. |
| `moderator` | Existe en el catálogo con propósito de moderar comunidad. | Cola de moderación, acciones, permisos y estados de revisión. |
| `support` | Existe en el catálogo con propósito de consultar usuarios/incidencias. | Acceso de solo lectura, privacidad, auditoría y ruta de soporte. |

## Estados que toda guía debe cubrir

- Carga: indicar qué se está consultando o guardando.
- Vacío: explicar qué significa y cuál es la siguiente acción.
- Error: conservar contexto, explicar sin tecnicismos innecesarios y permitir reintento.
- Éxito: confirmar la operación y su alcance.
- Sin permiso: explicar que el acceso depende del rol, sin exponer datos internos.
