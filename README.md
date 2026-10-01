# SOPHENA

`sophena.online` · Entiende. Decide. Avanza.

<p align="right"><a href="README.md">🇪🇸 Español</a> · <a href="README.en.md">🇬🇧 English</a></p>

SOPHENA es una PWA mobile-first para entender hábitos, registrar impulsos y recaídas, visualizar el progreso y convertir pequeñas decisiones en cambios sostenibles.

> **Nota importante:** SOPHENA es una herramienta de acompañamiento y autoobservación. No ofrece diagnóstico, tratamiento ni atención de emergencia. Si existe un riesgo inmediato o una situación de crisis, contacta los servicios de emergencia de tu país o a un profesional cualificado.

## Estado del proyecto

El proyecto está en desarrollo activo. La experiencia principal funciona con un modo demo local y puede conectarse a Supabase para autenticación y persistencia real. Las interfaces, el esquema de datos y las migraciones pueden evolucionar mientras consolidamos la primera versión pública.

## Funcionalidades

- Registro, inicio de sesión y recuperación de contraseña con Supabase Auth.
- Onboarding para definir hábitos, objetivos y motivaciones.
- Check-in diario y seguimiento de rachas.
- Registro de impulsos con intensidad, detonante y resultado.
- Registro de recaídas sin eliminar el historial.
- Seguimiento del dinero ahorrado y creación de recompensas.
- Puntos, logros, notificaciones y preferencias.
- Feed de novedades y consola administrativa con roles y permisos.
- PWA instalable con tema claro/oscuro y diseño responsive.
- Fallback local con `localStorage` para explorar los flujos sin configurar un backend.
- Interfaz en español e inglés, con detección del idioma del navegador y selector persistente.

Las versiones públicas indexables están disponibles en [`/es/`](https://sophena.online/es/) y [`/en/`](https://sophena.online/en/). Cada una tiene sus propios metadatos SEO, Open Graph, canonical, `hreflang` y datos estructurados.

## Vista rápida de la plataforma

El README incluye una preview estática para que las personas puedan entender la experiencia antes de ejecutar el proyecto. Está construida con HTML compatible con GitHub y representa algunos componentes reales de SOPHENA:

<table>
  <tr>
    <td width="50%" valign="top">
      <strong>Tu proceso</strong><br>
      <small>Resumen de hoy</small>
      <br><br>
      <table>
        <tr><td><strong>12 días</strong><br><small>Racha actual</small></td><td><strong>91%</strong><br><small>Cumplimiento</small></td></tr>
        <tr><td><strong>$428.000</strong><br><small>Recuperado</small></td><td><strong>7</strong><br><small>Logros</small></td></tr>
      </table>
    </td>
    <td width="50%" valign="top">
      <strong>Check-in diario</strong><br>
      <small>Un momento para observar cómo vas</small>
      <br><br>
      <blockquote>“Cada decisión consciente cuenta.”</blockquote>
      <p>◉ Hoy elegiste continuar</p>
      <progress value="91" max="100">91%</progress>
    </td>
  </tr>
</table>

<details>
  <summary><strong>Ver fragmento HTML del resumen</strong></summary>

```html
<section aria-labelledby="process-title">
  <h2 id="process-title">Tu proceso</h2>
  <p>Resumen de hoy</p>

  <div role="list" aria-label="Indicadores de progreso">
    <article role="listitem">
      <strong>12 días</strong>
      <span>Racha actual</span>
    </article>
    <article role="listitem">
      <strong>91%</strong>
      <span>Cumplimiento</span>
    </article>
    <article role="listitem">
      <strong>$428.000</strong>
      <span>Recuperado</span>
    </article>
  </div>
</section>
```

</details>

<details>
  <summary><strong>Ver fragmento HTML del check-in diario</strong></summary>

```html
<section aria-labelledby="check-in-title">
  <h2 id="check-in-title">Check-in diario</h2>
  <p>Un momento para observar cómo vas</p>
  <blockquote>“Cada decisión consciente cuenta.”</blockquote>
  <label for="daily-progress">Progreso de la semana</label>
  <progress id="daily-progress" value="91" max="100">91%</progress>
</section>
```

</details>

> Esta preview es documentación visual y no sustituye la aplicación ejecutable. GitHub sanitiza JavaScript y gran parte del CSS dentro de los README; para ver la experiencia completa, ejecuta el proyecto localmente.

## Stack

- React 19 + Vite
- React Router, Framer Motion, Recharts y Lucide React
- Supabase Auth, Postgres, RLS y Edge Functions
- `vite-plugin-pwa` para la experiencia instalable

## Design & UX

Sophena mantiene un sistema de diseño y reglas de UI/UX para agentes y contribuidores:

- [`docs/DESIGN_SYSTEM.md`](docs/DESIGN_SYSTEM.md)
- [`docs/UX_FLOWS.md`](docs/UX_FLOWS.md)
- [`.agents/skills/apple-product-ui-ux/SKILL.md`](.agents/skills/apple-product-ui-ux/SKILL.md)

El sistema está inspirado en principios de producto como claridad, jerarquía, calma, accesibilidad y progressive disclosure, adaptados a la identidad propia de Sophena.

## Requisitos

- Node.js 20 o superior
- npm 10 o superior
- Opcional: [Supabase CLI](https://supabase.com/docs/guides/cli) para trabajar con la base de datos

## Ejecutar localmente

```bash
git clone https://github.com/USER-2020/SOPHENA.git
cd sophena
npm install
npm run dev
```

Abre la URL que muestre Vite, normalmente `http://localhost:5173`.

Sin variables de entorno, la app inicia en modo demo y guarda los datos en el navegador. Para limpiar el estado local, borra los datos del sitio desde las herramientas del navegador o ejecuta en la consola:

```js
localStorage.removeItem('nuvora-local-state')
localStorage.removeItem('sophena-pending-onboarding')
```

## Configurar Supabase

1. Crea un proyecto en Supabase.
2. Copia `.env.example` a `.env`.
3. Completa `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY` con los valores de tu proyecto.
4. Inicia sesión y enlaza el proyecto:

   ```bash
   npx supabase login
   npx supabase link --project-ref TU_PROJECT_REF
   npx supabase db push
   ```

5. En Supabase Authentication, configura el proveedor Email.
6. En **Authentication → URL Configuration**, añade `http://localhost:5173/reset-password` a las Redirect URLs. En producción, añade también la URL HTTPS final.

Las migraciones viven en [`supabase/migrations`](supabase/migrations). El esquema inicial crea perfiles, hábitos, metas, check-ins, impulsos, recaídas, ahorros, logros, recompensas y preferencias, con políticas RLS para aislar los datos de cada usuario. `supabase/schema.sql` se conserva como referencia.

### Variables de entorno

| Variable | Obligatoria | Uso |
| --- | --- | --- |
| `VITE_SUPABASE_URL` | Solo con backend | URL pública del proyecto Supabase |
| `VITE_SUPABASE_ANON_KEY` | Solo con backend | Clave pública `anon` de Supabase |

No guardes claves de servicio, tokens ni archivos `.env` en el repositorio. Las variables con prefijo `VITE_` quedan disponibles en el navegador y no deben contener secretos.

## Scripts disponibles

| Comando | Descripción |
| --- | --- |
| `npm run dev` | Servidor de desarrollo con recarga en caliente |
| `npm run build` | Compila la aplicación para producción |
| `npm run preview` | Sirve localmente la compilación de producción |

Antes de abrir un Pull Request, ejecuta al menos `npm run build`.

## Estructura del proyecto

```text
.
├── public/                 # Iconos y recursos públicos
├── src/
│   ├── config/             # Identidad y configuración de marca
│   ├── lib/                # Clientes de infraestructura, como Supabase
│   ├── services/           # Acceso a datos y fallback local
│   ├── main.jsx            # Rutas y vistas de la aplicación
│   └── *.css               # Estilos base, responsive y rebranding
├── supabase/
│   ├── functions/          # Edge Functions
│   ├── migrations/         # Cambios versionados de base de datos
│   └── schema.sql          # Referencia del esquema
├── .github/                # Guías, plantillas y configuración comunitaria
└── vite.config.js
```

La capa de acceso está en `src/services/api.js`; los componentes visuales no deberían llamar a Supabase directamente. Los cambios de base de datos deben entrar como una nueva migración, ser compatibles con los datos existentes y documentar cualquier paso manual.

## Cómo contribuir

Las contribuciones de código, diseño, documentación, accesibilidad, traducción e ideas de producto son bienvenidas. Antes de empezar, lee [`CONTRIBUTING.md`](CONTRIBUTING.md), [`CODE_OF_CONDUCT.md`](CODE_OF_CONDUCT.md) y [`SECURITY.md`](SECURITY.md).

Si no sabes por dónde empezar, busca Issues con las etiquetas `good first issue` o `help wanted`. Para reportar un error, usa la plantilla de bug; para proponer una mejora, usa la plantilla de funcionalidad.

## Privacidad y seguridad

SOPHENA puede manejar información personal y sensible. No incluyas datos reales de usuarios, capturas identificables, tokens ni credenciales en Issues, Pull Requests o commits. Las vulnerabilidades deben reportarse de forma privada siguiendo [`SECURITY.md`](SECURITY.md).

## Licencia

Este proyecto se distribuye bajo la [Licencia MIT](LICENSE). Consulta el archivo para conocer los términos completos.

## Contacto

- Sitio: [sophena.online](https://sophena.online)
- Preguntas, ideas y errores: [abre un Issue](https://github.com/USER-2020/SOPHENA/issues)
