# Guía para agentes de Sophena

Antes de modificar UI o UX, consulta `.agents/skills/apple-product-ui-ux/SKILL.md`. Cuando el cambio lo requiera, consulta también `docs/DESIGN_SYSTEM.md`, `docs/UX_FLOWS.md` y `docs/SOPHENA_PRODUCT.md`.

Reglas permanentes:

- Preserva la lógica, API, autenticación, base de datos y flujos existentes.
- Reutiliza componentes y patrones antes de crear otros nuevos; evita duplicados y dependencias innecesarias.
- Usa design tokens y evita colores o valores arbitrarios cuando exista un token.
- Diseña mobile-first; responsive y accesibilidad son obligatorios.
- Considera dark/light si el proyecto lo soporta y mantén coherencia con Sophena.
- Respeta el principio de progreso sin castigo: nunca uses culpa ni dark patterns.

Antes de una modificación visual: entender la pantalla, identificar la acción principal, evaluar jerarquía, revisar componentes y tokens, diseñar mobile, adaptar tablet y desktop, implementar, comprobar estados, accesibilidad, motion y `prefers-reduced-motion`.
