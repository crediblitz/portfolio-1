# Portfolio Template 1

This template is designed for Crediblitz-generated portfolio repos.

## Editable Data Contract

All portfolio content lives in one file:

```txt
public/portfolio-data.json
```

Your backend can update the whole website by replacing that JSON file before deployment. The React components read from this file through `lib/portfolio-content.ts`, so your `crediblitz-frontend` app does not need to edit `app/page.tsx`.

The JSON has three top-level keys:

- `metadata`: page language, title, and description.
- `portfolio`: user data from the Crediblitz profile/onboarding flow.
- `ui`: template labels, section copy, nav items, badge rules, skill clusters, stat cards, CTA text, and display configuration.

## Remote Data Option

If your backend serves the portfolio JSON from an API, set:

```txt
PORTFOLIO_DATA_URL=https://your-backend.com/api/portfolio-data/:id
```

When this environment variable exists, the template loads data from that URL instead of `public/portfolio-data.json`.

## Local Development

```bash
bun install
bun run dev
```

## Validation

```bash
bun run lint
bun run build
```
