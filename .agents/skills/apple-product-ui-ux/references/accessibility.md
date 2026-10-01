# Accesibilidad

Objetivo: WCAG AA.

- Contraste suficiente para texto, controles y estados; no comuniques un estado solo con color.
- Orden de teclado, `focus-visible` claro y foco gestionado en sheets/modales.
- Labels visibles y nombres accesibles para icon-only controls; usa `aria-label` solo cuando corresponda.
- Mensajes de error cercanos al campo y asociados; anuncia estados relevantes sin ruido.
- Targets táctiles de aproximadamente 44×44 px.
- Estados default, hover, focus, pressed, disabled, loading, success, error y empty.
- Inputs con tipo, `inputMode`, autocomplete y texto de ayuda apropiados; nunca uses placeholder como único label.
- Screen readers: semántica HTML antes que `div`, headings ordenados y tablas/gráficas con alternativa textual.
- Respeta `prefers-reduced-motion` y considera daltonismo al elegir estados.
