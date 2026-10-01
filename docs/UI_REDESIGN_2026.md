# Auditoría y rediseño UI/UX 2026

## Alcance

Se revisaron la arquitectura actual de Sophena, sus rutas principales, el shell personal, los flujos de autenticación/onboarding, registro rápido, progreso, metas, perfil, feed y consola superadmin, junto con `styles.css`, `rebrand.css`, `responsive.css`, `brand.js` y la documentación de producto.

## Hallazgos principales

- La lógica y los flujos existentes son reutilizables y no requieren una reescritura para mejorar la experiencia.
- La identidad estaba repartida entre gradientes, hexadecimales y tokens parciales.
- La acción principal del dashboard sí existe, pero compite con demasiadas superficies de igual peso visual.
- Las vistas móviles y los sheets son el punto de mayor sensibilidad para foco, scroll, safe areas y targets táctiles.
- Las variantes Legacy/Connected deben consolidarse en una tarea separada para evitar alterar contratos de datos.

## Decisiones de diseño

- Calma y claridad antes que densidad: superficies más sobrias, menos elevación y jerarquía más marcada.
- Una acción primaria clara, con botones secundarios más silenciosos.
- Escala compartida de spacing, radios, elevación y tipografía.
- Touch first: controles interactivos de al menos 44 px.
- Feedback accesible: focus visible, errores con borde además de color y estados activos reconocibles.
- Movimiento limitado a cambios de estado y respetuoso de `prefers-reduced-motion`.

## Implementación

`src/product-ui.css` se carga después de las hojas existentes para actuar como capa transversal. No cambia rutas, API, autenticación, base de datos, dependencias, contratos de `dataApi` ni la configuración remota de temas.

## Verificación

- `npm.cmd run build` completado correctamente con Vite.
- Se mantiene el warning existente de tamaño del bundle principal.
- La validación visual final debe hacerse en 320, 375, 390, 430, 768, 1024, 1280 y 1440 px con datos demo y Supabase.
- Queda como siguiente iteración: focus trap de modales, alternativas textuales de gráficas y consolidación incremental de variantes Legacy/Connected.
