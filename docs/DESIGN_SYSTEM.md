# Sophena Design System

## Base actual

La UI es dark-first y usa una identidad púrpura/verde con ámbar y danger. `src/config/brand.js` define colores dark/light y `brandTheme`; `ThemeController` aplica variables y puede cargar un tema activo desde Supabase. Los CSS actuales complementan esto con `--bg`, `--surface`, `--card`, `--purple`, `--green`, `--amber`, `--danger`, `--border`, además de muchos hexadecimales directos.

## Tokens compatibles

| Token conceptual | Uso actual/recomendado |
| --- | --- |
| background | fondo de página (`bg`) |
| surface | paneles y superficies (`surface`) |
| surface-secondary | `card` o una futura superficie secundaria |
| text-primary | `text` |
| text-secondary | `muted` |
| accent | `purple`/`purpleStrong` |
| success | `success`/`green` |
| warning | `warning`/`amber` |
| danger | `danger` |
| border/divider | `border` y divisores actuales |

Normalización compatible propuesta: centralizar estos nombres en variables CSS, mantener el tema remoto y migrar hexadecimales por zonas, no mediante una refactorización masiva.

## Typography, spacing y forma

Mantener el stack del sistema; puede expresarse como `-apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Display", Inter, system-ui, sans-serif` sin redistribuir fuentes de Apple. Preferir spacing 4/8/12/16/20/24/32/40/48/64. Usar radios pequeños, medios, grandes, xl y full; reservar pills para estados o controles que lo necesiten.

Las sombras deben ser suaves y escasas. El blur existente en navegación y overlays debe explicar profundidad o contexto, no ser decoración omnipresente.

## Componentes actuales

Hay `Button`, `ProgressRing`, cards de métricas/insights/recompensas/logros, navegación desktop/móvil, sheets de registro, modales de perfil/hábitos, loaders y mensajes de error. Lucide React es la librería de iconos y Framer Motion la de motion. Ver `.agents/skills/apple-product-ui-ux/references/components.md`.

## Inconsistencias a normalizar

- Tokens parciales mezclados con hexadecimales y nombres heredados.
- Radios, sombras y colores semitransparentes variados entre CSS base, rebrand y responsive.
- Variantes Legacy y conectadas conviven en `main.jsx`.
- La escala de typography y spacing no está formalizada como tokens.

Estas son recomendaciones P1/P2, no cambios realizados aquí.
