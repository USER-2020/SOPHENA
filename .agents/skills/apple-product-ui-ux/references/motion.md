# Motion

El movimiento debe comunicar cambio de estado, navegación, relación espacial, feedback, éxito o expansión/contracción. No lo añadas solo por decoración.

- Microinteracciones: 120–180 ms.
- Transiciones: 200–300 ms.
- Entradas complejas: 300–450 ms.
- Preferir ease-out o spring natural.

Sophena ya usa Framer Motion para entradas, `AnimatePresence`, anillos, números, splash, sheets y hover. Reutilízalo; no instales otra librería. El CSS también contiene transiciones y una regla `prefers-reduced-motion: reduce`; toda animación nueva debe respetarla y no depender de hover en touch.
