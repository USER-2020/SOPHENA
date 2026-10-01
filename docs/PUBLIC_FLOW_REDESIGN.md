# Rediseño del flujo público

## Rutas cubiertas

- `/welcome`
- `/login`
- `/forgot-password`
- `/reset-password`
- `/register`
- `/onboarding`
- `/feed`

## Dirección de producto

La entrada pública ahora comunica una sola secuencia: entender Sophena, comenzar o entrar, completar un plan sencillo y recibir confirmación clara. La privacidad aparece como confianza contextual y no como ruido visual.

## Cambios aplicados

- Bienvenida con acción primaria única, jerarquía tipográfica más clara y composición responsive mobile-first.
- Login y recuperación con formularios más legibles, campos de 16 px, targets táctiles de 44 px, focus visible y estados de error/éxito diferenciados.
- Onboarding con progresión más evidente, selección de hábitos y objetivos con estados activos claros y footer persistente en móvil.
- Modal de creación/verificación con elevación y overlay consistentes.
- Feed público separado visualmente de la consola, con lectura editorial, tarjetas flexibles y estado vacío conservado.
- `prefers-reduced-motion`, safe areas y layouts para 320–1440 px.

## Conservación funcional

No se modificaron rutas, autenticación, servicios Supabase/locales, validaciones, payloads, persistencia ni contratos de `dataApi`. La implementación vive en `src/public-flow.css`, cargada después de los estilos de producto compartidos.
