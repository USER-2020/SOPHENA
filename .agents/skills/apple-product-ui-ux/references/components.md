# Componentes y patrones

## Existentes y reutilizables

- `Button` y sus variantes: acción primaria y variantes visuales.
- `Logo`, `ProgressRing`, `AnimatedNumber`, `StatCard`, `InsightCard`, `SettingRow`.
- `AppShellWithMenu`, sidebar, header móvil y bottom navigation.
- `ActionSheet`, `Modal`/backdrops de perfil y hábitos, `Toast`/mensajes inline cuando estén disponibles.
- `CreationLoader`, `EmailVerificationModal`, estados de formulario con `loading` y `form-error`.
- `HabitManager`, `HabitCard`/filas de hábitos, cards de recompensas y logros.

La implementación está concentrada en `src/main.jsx`; antes de extraer primitives comprueba el alcance y evita cambiar rutas o contratos de `dataApi`.

## Abstracciones con sentido

Según el contexto, pueden formalizarse `PageHeader`, `SectionHeader`, `PrimaryButton`, `SecondaryButton`, `IconButton`, `ProgressBar`, `HabitCard`, `MetricCard`, `InsightCard`, `SegmentedControl`, `BottomNavigation`, `SidebarNavigation`, `ActionSheet`, `EmptyState`, `LoadingState`, `ErrorState` y `SuccessState`. Son recomendaciones, no una orden de crearlos todos.

## Duplicación observada

`main.jsx` conserva variantes `Legacy`, estáticas y conectadas de varias pantallas (`Auth`, registro, dashboard, progreso, recompensas y sheets). Antes de añadir una variante, identifica cuál está conectada en la ruta actual. La consolidación es una tarea posterior, no parte de esta documentación.

## Cards, botones e iconos

Una card debe ser una agrupación lógica o interacción. Usa whitespace, tipografía y divisores antes de anidar cards. Mantén una acción Primary dominante; targets táctiles aproximados de 44×44 px. Lucide React es la familia instalada: no agregues otra familia sin una razón técnica.
