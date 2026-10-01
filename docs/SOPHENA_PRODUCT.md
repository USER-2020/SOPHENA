# Sophena Product Model

Este documento separa la implementación actual de recomendaciones. La fuente de verdad es `src/main.jsx` y `src/services/api.js`.

## Implementación actual

- **Entrada:** `/welcome`, con propuesta de valor, registro e inicio de sesión.
- **Cuenta:** `/login`, `/register`, `/forgot-password` y `/reset-password`; autenticación Supabase o modo demo/local.
- **Onboarding:** wizard conectado (`RegisterConnectedV2`) para datos personales, hábitos, objetivo, gasto y motivación; guarda onboarding pendiente y lo completa al autenticarse.
- **Experiencia personal:** `/app/*` con shell, sidebar desktop, header/bottom navigation móvil y módulos dinámicos habilitados por configuración.
- **Inicio:** dashboard con resumen, racha, métricas, check-in, acción rápida, tendencia e insights.
- **Hábitos y registros:** hábitos y objetivos; check-in diario; impulsos con intensidad, detonante y resultado; recaídas; gasto evitado/ahorros.
- **Progreso:** `/app/progress`, con historial/calendario, tendencias e insights derivados de registros.
- **Metas y recompensas:** `/app/rewards`, logros, puntos/XP y recompensas creadas por el usuario.
- **Perfil:** `/app/profile`, datos personales, hábitos/objetivos, notificaciones, puntos, privacidad y logout.
- **Novedades:** `/feed`, feed administrable.
- **Administración:** `/super-admin/*`, login, usuarios, roles/permisos, módulos, ajustes, temas, logros, feed y documentación.
- **Persistencia:** Supabase cuando está configurado; fallback `localStorage` para demo.
- **Presentación:** idioma español/inglés, tema cargado desde configuración, PWA y responsive.

## Relaciones principales

Onboarding crea hábitos y objetivos. Los registros diarios alimentan progreso, rachas, ahorros, puntos y evaluación de logros. Perfil administra preferencias y datos; administración controla módulos, contenido y temas.

## Acciones principales por sección

| Sección | Acción principal | Secundarias |
| --- | --- | --- |
| Inicio | Registrar el momento de hoy | Consultar progreso, tendencias e insights |
| Onboarding | Completar el plan inicial | Atrás, elegir hábitos y motivación |
| Progreso | Entender la tendencia | Explorar historial e insights |
| Recompensas | Consultar avance/desbloqueos | Crear recompensas |
| Perfil | Gestionar cuenta y hábitos | Editar perfil, logout |
| Admin | Gestionar configuración/contenido | Usuarios, roles, módulos y feed |
