# FOM Test Drive Survey

A React + Vite + Tailwind CSS single-page survey for capturing Mahindra dealership test drive
feedback, deployed on Vercel with submissions forwarded to Pabbly Connect.

## Stack

- React + Vite
- Tailwind CSS (via `@tailwindcss/vite`)
- Manrope (Google Fonts)
- Vercel serverless function (`api/submit.js`) forwarding to a Pabbly webhook

## URL parameters

The survey is loaded with query parameters that identify the dealership visit:

| Param      | Description                                          |
| ---------- | ----------------------------------------------------- |
| `id`       | Unique survey ID, stored as `surveyId` on submission   |
| `dealer`   | Dealership name, shown in step titles and headings     |
| `expires`  | Expiry date — survey shows an expired screen after it  |

Example: `/?id=abc123&dealer=ACME%20Motors&expires=2026-12-31`

## Local development

```bash
npm install
npm run dev
```

The `/api/submit` endpoint only runs under the Vercel runtime (`vercel dev`), not plain
`vite dev` — locally, submissions will fail against `vite dev` unless you use `vercel dev`.

## Environment variables

Set in the Vercel project (see `.env.example`):

- `PABBLY_WEBHOOK_URL` — the Pabbly Connect webhook URL that submissions are forwarded to.

## Deployment

Auto-deploys to Vercel from the `main` branch.
