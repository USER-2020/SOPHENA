# UI Audit actual

Auditoría estática realizada sobre `src/main.jsx`, `src/styles.css`, `src/rebrand.css`, `src/responsive.css`, `src/config/brand.js`, `src/services/api.js` y `package.json`. No se modificó la UI.

## Strengths

- Identidad propia consistente alrededor de calma, progreso y acompañamiento.
- React Router, Framer Motion, Recharts y Lucide ya cubren navegación, motion, datos e iconografía.
- Existe responsive mobile con bottom navigation, safe-area inferior y layouts adaptados.
- Hay dark/light theme, configuración remota y fallback local para explorar sin backend.
- Existen estados loading/error en autenticación, creación y action sheet.
- El registro de recaída usa lenguaje no punitivo y conserva el historial.

## Inconsistencies

- `main.jsx` concentra muchas vistas y conserva implementaciones Legacy, estáticas y conectadas.
- Tokens parciales conviven con hexadecimales directos; hay escalas de radio, sombra y spacing implícitas.
- Hay componentes con responsabilidades similares que aún no comparten una primitive única.
- La navegación personal y administrativa viven en el mismo archivo, elevando el coste de mantenimiento.

## UX friction

- El onboarding es un wizard de cuatro pasos y debe validarse en móvil; algunos campos y decisiones podrían requerir demasiado contexto simultáneo.
- El dashboard reúne métricas, progreso, chart, insights y acciones: validar que la acción del día siga dominante.
- El action sheet ofrece cuatro registros; preservar el acceso rápido y reservar detalles para progressive disclosure.

## Responsive

- Existen reglas para 1050, 900, 760, 600 y 430 px, además de mobile bottom nav.
- Validar explícitamente 320/375/390/430 y landscape; revisar overflow de grids de hábitos, admin y formularios.
- Validar scroll y foco de sheets/modales junto con teclado virtual y safe areas.

## Accessibility

- Hay labels, algunos `aria-label`, focus styles y reduced motion.
- Auditar contraste de textos muted/faint, foco de overlays, nombres de icon-only buttons, orden de headings y alternativas textuales para charts.
- Confirmar que todos los estados de error/loading se anuncien y que ningún estado dependa solo de color.

## Components

- Reutilizar `Button`, `ProgressRing`, cards, `ActionSheet`, `HabitManager`, navegación y loaders.
- Revisar las variantes Legacy antes de crear duplicados. La extracción de primitives debe ser incremental.

## Design tokens

- `brand.js` es un buen punto de consolidación, pero hay valores directos repartidos por tres hojas CSS.
- P1: definir nombres semánticos comunes y migrar por componente. P2: formalizar spacing/radius/elevation/motion.

## Motion

- Framer Motion aporta entradas, sheets, ring, números y hover.
- Ya existe `prefers-reduced-motion`; comprobar que las animaciones SVG y de splash respeten la preferencia y que hover no sea la única señal.

## Priority

- **P0:** ninguno identificado en esta auditoría estática; requiere prueba funcional y accesible para confirmarlo.
- **P1:** auditar autenticación/onboarding en móvil; consolidar tokens semánticos; asegurar foco y nombres accesibles en overlays.
- **P2:** reducir duplicación Legacy/conectada; normalizar cards, spacing y radios; añadir estados vacíos explícitos donde falten.
- **P3:** pulir motion, sombras y detalles de responsive en admin y charts.

## No modificado

No se cambiaron lógica, API, autenticación, base de datos, rutas, dependencias ni componentes visuales.
