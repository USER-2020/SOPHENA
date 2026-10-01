# Design tokens

## Estado actual

Sophena tiene tokens parciales en `src/config/brand.js` (`brandTheme` y colores light/dark) y variables CSS como `--bg`, `--surface`, `--card`, `--purple`, `--green`, `--amber`, `--danger` y `--border`. Sin embargo, varios estilos todavía usan hexadecimales directos en `src/styles.css`, `src/rebrand.css` y `src/responsive.css`.

## Regla de uso

Antes de crear un valor, busca el token equivalente. Consolida gradualmente, sin reemplazar todo el sistema en una tarea de documentación.

| Categoría | Dirección compatible |
| --- | --- |
| Color | `bg`, `surface`, `card`, `text`, `muted`, `faint`, `purple`, `green`, `amber`, `danger`, `success`, `warning`, `border` |
| Typography | Mantener el stack actual; preferir `-apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Display", Inter, system-ui, sans-serif` sin distribuir fuentes propietarias |
| Spacing | Escala preferida: 4, 8, 12, 16, 20, 24, 32, 40, 48, 64 px |
| Radius | Escala pequeña: small 8, medium 12, large 16, xl 24, full 9999 px; no convertir todo en pill |
| Elevation | Pocas sombras suaves; el blur debe explicar profundidad o contexto |
| Opacity | Preferir transparencias consistentes existentes; no usar opacidad para ocultar estados importantes |
| Motion | 120–180 ms microinteracción, 200–300 ms transición, 300–450 ms entrada compleja |
| Breakpoints | Validar 320, 375, 390, 430, 768, 1024, 1280 y 1440; revisar CSS antes de añadir uno |
| z-index | Mantener una escala explícita para navegación, sheets, modales y overlays; evitar números arbitrarios nuevos |

Los colores se cargan dinámicamente desde `brandTheme` y un tema activo de `dataApi.themeService`; cualquier consolidación debe conservar light/dark y temas remotos.
