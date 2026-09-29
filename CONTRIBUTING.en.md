# Contributing to SOPHENA

Thank you for helping improve SOPHENA. We want contributing to be clear, safe, and welcoming, especially because the product touches habits, well-being, and personal data.

<p align="right"><a href="CONTRIBUTING.md">🇪🇸 Español</a> · <a href="CONTRIBUTING.en.md">🇬🇧 English</a></p>

## Before you start

1. Search existing Issues for duplicates.
2. For large changes, open an Issue first to agree on scope.
3. Never use real user data in development, screenshots, fixtures, or examples.
4. Read the [Code of Conduct](CODE_OF_CONDUCT.en.md) and [Security guide](SECURITY.en.md).

## Set up the project

```bash
npm install
npm run dev
```

You can use the local fallback or configure Supabase as described in the README. Local mode is enough for UI changes and most frontend flows.

## Recommended workflow

1. Create a descriptive branch:

   ```bash
   git switch -c feat/short-name
   ```

2. Keep changes small and focused.
3. Keep UI and data access separate: Supabase calls belong in `src/services/api.js`.
4. For database changes, add a new migration under `supabase/migrations`; never edit an applied migration.
5. Check mobile and desktop layouts, including loading, error, and empty states.
6. Run the verification command:

   ```bash
   npm run build
   ```

7. Open a Pull Request using the template and explain what changed, how to test it, and what remains.

## Conventions

- Use clear names consistent with the existing code.
- Match the interface language and tone when adding Spanish or English copy.
- Prefer semantic HTML, keyboard navigation, visible focus, sufficient contrast, and accessible labels.
- Avoid adding dependencies when an existing solution covers the need.
- Never add secrets or environment-specific values.
- Use a short commit prefix when useful: `feat:`, `fix:`, `docs:`, `refactor:`, `chore:`.

## Issues and Pull Requests

Bug reports should include the browser, device, reproduction steps, expected result, actual result, and an anonymized screenshot when useful. Use `good first issue` for scoped tasks, `help wanted` when community help is requested, and area labels such as `frontend`, `backend`, and `documentation`.

A good PR explains the problem and solution, links the related Issue, includes test steps, shows UI changes, declares schema or environment changes, and keeps the scope reviewable.

## Questions

If you are unsure about a decision, open an Issue with context or ask in your PR. Making uncertainty visible early is better than investing time in a direction that is hard to reverse.
