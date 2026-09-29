# Security

<p align="right"><a href="SECURITY.md">🇪🇸 Español</a> · <a href="SECURITY.en.md">🇬🇧 English</a></p>

Security and privacy are especially important for SOPHENA because the app may handle information related to habits and well-being.

## Report a vulnerability

Do not open a public Issue for a vulnerability. Contact the maintainers through the repository's private security channel or, when available, use **Security → Advisories → Report a vulnerability** on GitHub.

Include:

- a description and impact;
- minimal reproduction steps;
- the affected component or file;
- the version, commit, or environment;
- a possible mitigation, if known.

Remove tokens, credentials, personal data, and real user information. If a report involves a real account or database, stop and communicate only through the private channel.

## What to expect

We will acknowledge receipt when possible, investigate impact, coordinate a fix, and communicate resolution when a mitigation exists. We do not promise a fixed response time while the project is in volunteer development.

## Contributor best practices

- Use only public `anon` keys in the frontend.
- Never commit `.env`, service keys, passwords, or tokens.
- Check RLS policies when changing tables or queries.
- Use synthetic data and test accounts.
- Avoid sensitive information in logs, screenshots, and error messages.
