# vokve-frontend — the VOKVE website

The public site at vokve.com: home, about, FAQ, contact, the legal documents
(privacy, terms, coins & fair play, refunds, shipping, licences), the account
deletion page, and the landing page behind the app's invite links (`/r/:code`).

Next.js 16.4.6 (App Router, Cache Components, React Compiler), Tailwind 4,
`lucide-react` icons, `zod` for the content contract.

## Run it

```bash
npm install
npm run dev          # http://localhost:3002  (3000 = backend, 3001 = CRM)
npm run build && npm start
npm run typecheck    # route types + tsc
npm run lint
```

## Where the content comes from

**Every word and number on the site comes from the backend.** Until the
backend serves `/v1/site/*`, it comes from the mock files in
`src/content/mock/`, which are validated against the same schemas.

```bash
cp .env.example .env.local
# VOKVE_CONTENT_API_URL=http://localhost:3000/v1   → read the backend
# (leave it empty)                                 → read the mocks
# VOKVE_API_URL=http://localhost:3000/v1           → live contact details only
```

The contact details — support email, phone, WhatsApp, address, store links,
social profiles — are already live: the CRM's **Contact & links** page edits
them, the backend serves them at `GET /v1/site/company`, and every page folds
them in (copy says `{{email}}`, never the address itself).

The full contract — endpoints, shapes, which backend config each value should
come from, and the revalidation webhook — is in
[docs/CONTENT_API.md](docs/CONTENT_API.md).

> The legal texts in `src/content/mock/legal/` are drafts written from what the
> app and backend actually do. Have them reviewed before publishing.

## Design: the morning walk

Warm paper-toned neutrals, the app icon's flat red as the one accent, brass
only on the coin (`src/app/globals.css`). Nothing glows and nothing floats;
depth is surface steps and hairlines. Instrument Sans for everything (400/500),
Geist Mono for figures, dates and counts.

- `.card` (raised surface), `.well` (inset area), `.chip` (quiet mono meta),
  `.icon-box` (neutral icon square), `.btn` + `.btn-primary` / `.btn-secondary`
  (`.btn-lg`, `.btn-sm`), `.section-label` (the short name above a heading).
- **The signature is the day line** (`components/ui/DayLine.tsx`): a day as
  the wallet writes it — `Today · 8,432 steps · +7.98 coins` — with a dot for
  its coins' state (grey counted, amber pending, green paid). It appears only
  where a day is shown: the Today card, how it works, the fair-play chart and
  the invite page.
- The colour lives in two moments on the home page: the step ring in the hero
  card (`home/TodayCard.tsx`, with the brass `CoinMark` resting on it) and
  the hour-by-hour day chart (`home/DayChart.tsx`). Everything else is quiet.
- Motion: one fade-and-rise for the hero and the ring filling once, both off
  under reduced motion; hovers are colour changes. One easing curve,
  `--ease-standard`.
- Light and dark follow the system; the toggle stores a choice in
  `localStorage` and an inline script applies it before first paint.

## Layout

```
src/app/                 routes (one folder per page), sitemap, robots, OG image, /api/revalidate
src/components/home/     home page sections, the Today card and the day chart
src/components/legal/    the shared legal-document layout
src/components/ui/       server components: icons, logo, links, rich text, headings
src/components/client/   the only client code: nav, theme toggle, FAQ search, TOC, copy
src/lib/content/         schemas (the contract), the loader, and cached getters
src/content/mock/        mock responses, one per endpoint
```
# vokve-frontend
