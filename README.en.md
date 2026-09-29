# SOPHENA

`sophena.online` · Understand. Decide. Move forward.

<p align="right"><a href="README.md">🇪🇸 Español</a> · <a href="README.en.md">🇬🇧 English</a></p>

SOPHENA is a mobile-first PWA for understanding habits, logging urges and relapses, tracking progress, and turning small decisions into sustainable change.

> **Important:** SOPHENA is a self-observation and support tool. It does not provide diagnosis, treatment, or emergency care. If there is an immediate risk or crisis, contact your local emergency services or a qualified professional.

## Project status

The project is under active development. The main experience works in local demo mode and can connect to Supabase for real authentication and persistence. Interfaces, the data schema, and migrations may evolve as we consolidate the first public release.

## Features

- Sign up, sign in, and password recovery with Supabase Auth.
- Onboarding for habits, goals, and motivations.
- Daily check-ins and streak tracking.
- Urge logging with intensity, trigger, and outcome.
- Relapse logging without deleting history.
- Savings tracking and personal rewards.
- Points, achievements, notifications, and preferences.
- Updates feed and role-based administration console.
- Installable PWA with light/dark theme and responsive layout.
- Local `localStorage` fallback for exploring flows without a backend.
- Spanish/English UI with browser-language detection and a persistent switch.

The indexable public versions are available at [`/es/`](https://sophena.online/es/) and [`/en/`](https://sophena.online/en/). Each version has its own SEO metadata, Open Graph tags, canonical URL, `hreflang`, and structured data.

## Platform preview

The README includes a static preview so contributors can understand the product before running it:

<table>
  <tr>
    <td width="50%" valign="top">
      <strong>Your journey</strong><br>
      <small>Today's summary</small>
      <br><br>
      <table>
        <tr><td><strong>12 days</strong><br><small>Current streak</small></td><td><strong>91%</strong><br><small>Completion</small></td></tr>
        <tr><td><strong>$428,000</strong><br><small>Recovered</small></td><td><strong>7</strong><br><small>Achievements</small></td></tr>
      </table>
    </td>
    <td width="50%" valign="top">
      <strong>Daily check-in</strong><br>
      <small>A moment to notice how you are doing</small>
      <br><br>
      <blockquote>“Every conscious decision counts.”</blockquote>
      <p>◉ Today you chose to continue</p>
      <progress value="91" max="100">91%</progress>
    </td>
  </tr>
</table>

<details>
  <summary><strong>View the HTML snippet</strong></summary>

```html
<section aria-labelledby="process-title">
  <h2 id="process-title">Your journey</h2>
  <p>Today's summary</p>
  <div role="list" aria-label="Progress indicators">
    <article role="listitem"><strong>12 days</strong><span>Current streak</span></article>
    <article role="listitem"><strong>91%</strong><span>Completion</span></article>
    <article role="listitem"><strong>$428,000</strong><span>Recovered</span></article>
  </div>
</section>
```

</details>

> This preview is documentation, not the executable application. GitHub sanitizes JavaScript and much of the CSS inside README files; run the project locally to experience the full interface.

## Stack

- React 19 + Vite
- React Router, Framer Motion, Recharts, and Lucide React
- Supabase Auth, Postgres, RLS, and Edge Functions
- `vite-plugin-pwa` for the installable experience

## Requirements

- Node.js 20 or newer
- npm 10 or newer
- Optional: [Supabase CLI](https://supabase.com/docs/guides/cli) for database work

## Run locally

```bash
git clone https://github.com/USER-2020/SOPHENA.git
cd SOPHENA
npm install
npm run dev
```

Open the URL shown by Vite, usually `http://localhost:5173`.

Without environment variables, the app starts in demo mode and stores data in the browser. The language defaults to the browser language when it is English; other languages default to Spanish. Use the ES/EN switch to change it, and the choice will be remembered in the browser.

## Configure Supabase

1. Create a Supabase project.
2. Copy `.env.example` to `.env`.
3. Fill in `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.
4. Link the project and push migrations:

   ```bash
   npx supabase login
   npx supabase link --project-ref YOUR_PROJECT_REF
   npx supabase db push
   ```

5. Configure Email under Supabase Authentication.
6. Under **Authentication → URL Configuration**, add `http://localhost:5173/reset-password` to Redirect URLs. Add the final HTTPS URL in production as well.

Migrations live in [`supabase/migrations`](supabase/migrations). The schema creates profiles, habits, goals, check-ins, urges, relapses, savings, achievements, rewards, and preferences with RLS policies that isolate each user's data. `supabase/schema.sql` is kept as a reference.

### Environment variables

| Variable | Required | Purpose |
| --- | --- | --- |
| `VITE_SUPABASE_URL` | Backend only | Public Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Backend only | Public Supabase `anon` key |

Never commit service keys, tokens, or `.env` files. Variables prefixed with `VITE_` are exposed to the browser and must not contain secrets.

## Available scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Development server with hot reload |
| `npm run build` | Production build |
| `npm run preview` | Serve the production build locally |

Run at least `npm run build` before opening a Pull Request.

## Project structure

```text
.
├── public/                 # Public icons and assets
├── src/
│   ├── config/             # Brand identity and configuration
│   ├── lib/                # Infrastructure clients, such as Supabase
│   ├── services/           # Data access and local fallback
│   ├── i18n.js             # Language detection, persistence, and switch
│   ├── main.jsx            # Application routes and views
│   └── *.css               # Base, responsive, and brand styles
├── supabase/
│   ├── functions/          # Edge Functions
│   ├── migrations/         # Versioned database changes
│   └── schema.sql          # Schema reference
├── .github/                # Community guides and templates
└── vite.config.js
```

Keep Supabase calls in `src/services/api.js`; visual components should not call Supabase directly. Database changes must use a new migration, remain compatible with existing data, and document any manual steps.

## Contributing

Code, design, documentation, accessibility, translation, and product ideas are welcome. Read the English or Spanish versions of [`CONTRIBUTING.md`](CONTRIBUTING.md), [`CODE_OF_CONDUCT.md`](CODE_OF_CONDUCT.md), and [`SECURITY.md`](SECURITY.md) before starting.

If you are unsure where to begin, look for `good first issue` or `help wanted`. Use the bug template for errors and the feature template for improvements. Issue and Pull Request templates are available in `.github/ISSUE_TEMPLATE` and `.github/PULL_REQUEST_TEMPLATE.md`.

## Privacy and security

SOPHENA may handle personal and sensitive information. Do not include real user data, identifiable screenshots, tokens, or credentials in Issues, Pull Requests, or commits. Report vulnerabilities privately using [`SECURITY.md`](SECURITY.md).

## License

This project is distributed under the [MIT License](LICENSE).

## Contact

- Website: [sophena.online](https://sophena.online)
- Questions, ideas, and bugs: [open an Issue](https://github.com/USER-2020/SOPHENA/issues)
