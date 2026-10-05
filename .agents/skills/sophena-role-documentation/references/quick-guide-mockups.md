# Plantillas de guías rápidas y mockups

Los mockups siguientes son esquemas de documentación. Antes de publicarlos, compáralos con la pantalla real y elimina cualquier acción que todavía no exista.

## Guía de usuario

```text
┌──────────────────────────────────────────────────────────────┐
│ SOPHENA              🔔  Perfil                              │
├──────────────────────────────────────────────────────────────┤
│ Tu espacio personal                                          │
│ Hola, [nombre]                                               │
│                                                              │
│ ┌────────────── Racha / objetivo ──────────────────────────┐ │
│ │ [progreso]                 Próximo objetivo →            │ │
│ └───────────────────────────────────────────────────────────┘ │
│ [ + Registrar ]     [ Progreso ]     [ Metas ]                │
├──────────────────────────────────────────────────────────────┤
│ Inicio      Progreso      Metas      Perfil      Novedades    │
└──────────────────────────────────────────────────────────────┘
```

Flujo mínimo: entrar → completar onboarding si aplica → revisar resumen → registrar el check-in del día → consultar progreso/notificaciones/feed.

## Guía de superadmin

```text
┌───────────────┬──────────────────────────────────────────────┐
│ SOPHENA       │ Resumen                         ES ◉ EN  👤  │
│ SUPER ADMIN   ├──────────────────────────────────────────────┤
│ Resumen       │ [KPI] [KPI] [KPI]                            │
│ Logros        │                                              │
│ Módulos       │ ┌──────────────┐  ┌────────────────────────┐ │
│ Temas         │ │ Roles        │  │ Permisos del rol       │ │
│ Feed          │ │ • superadmin │  │ ☑ usuarios             │ │
│ Puntos        │ │ • admin      │  │ ☑ módulos              │ │
│ Usuarios      │ │ • moderator  │  │ ☐ feed                 │ │
│ Roles         │ └──────────────┘  └────────────────────────┘ │
│ Documentación│                                              │
│ Ajustes       │ [Guardar cambios]                            │
└───────────────┴──────────────────────────────────────────────┘
```

Flujo mínimo: validar rol → elegir módulo → revisar estado/audiencia → editar → guardar → confirmar resultado y error.

## Gestión de novedades

```text
┌──────────────────────── Nueva publicación ──────────────────┐
│ Título                                                       │
│ Resumen                                                      │
│ Contenido [editor de texto enriquecido]                     │
│ Enlace       Categoría                                      │
│ Audiencia: Todos | Roles | Usuarios                         │
│ Publicar inmediatamente                         [Publicar]  │
└──────────────────────────────────────────────────────────────┘
                 ↓
┌──────────────────────── Feed ───────────────────────────────┐
│ [categoría]  Título resumido…                 Leer →         │
│ [categoría]  Título resumido…                 Leer →         │
└──────────────────────────────────────────────────────────────┘
```

La lista debe truncar el resumen con ellipsis y abrir `/feed/:postId` para el detalle; el detalle debe interpretar el contenido enriquecido de forma segura.

## Roles catalogados, pero sin consola propia

Para `admin`, `moderator` y `support`, usa una guía de estado, no un mockup que parezca implementado:

```text
┌──────────── Rol catalogado ────────────┐
│ Nombre: [rol]                          │
│ Propósito: [descripción de migración]  │
│ Estado: Catálogo / pendiente           │
│ Falta definir: ruta, permisos y UI     │
└────────────────────────────────────────┘
```

