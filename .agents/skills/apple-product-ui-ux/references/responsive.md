# Responsive y mobile-first

Diseña primero para touch y pantallas pequeñas. Valida aproximadamente 320, 375, 390, 430, 768, 1024, 1280 y 1440 px; no significa crear un breakpoint por tamaño.

- **Mobile:** contenido esencial, navegación alcanzable, targets de 44 px, safe areas y sheets cuando correspondan. Considera `env(safe-area-inset-top)` y `env(safe-area-inset-bottom)`. Usa inputs de al menos 16 px cuando sea necesario evitar zoom automático de Safari.
- **Tablet:** evalúa dos columnas, panel secundario y master/detail; no la trates como mobile gigante.
- **Desktop:** puede usar sidebar, split view y panel contextual; no estires el layout para llenar espacio artificialmente.

El CSS actual ya tiene mobile navigation, bottom nav, layouts de una columna, varios breakpoints hasta 1050/900/760/600/430 y `prefers-reduced-motion`. Reutilízalos y valida overflow, scroll, foco, teclado virtual y orientación.
