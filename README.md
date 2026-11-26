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

**Every word and number on the site comes from the backend,** and is edited
on the CRM's **Website** pages (RULES P22): the header and footer, Home (How it
works, Features, Challenges, Fair play…), About, FAQ, Contact and its form,
the legal hub, account deletion, licences, the invite page, and every policy —
including new ones created on the panel, served at their own address by
`app/[slug]`. The contact form's messages land on the CRM's **Enquiries** page.

```bash
cp .env.example .env.local
# VOKVE_CONTENT_API_URL=http://localhost:3000/v1   → read the backend (production)
# (leave it empty)                                 → read the mocks (design work)
# VOKVE_API_URL=http://localhost:3000/v1           → with the mocks: live contact details only
# CONTENT_REVALIDATE_SECRET=…                      → the backend's SITE_REVALIDATE_SECRET
```

The contact details — support email, phone, WhatsApp, address, store links,
social profiles — are on the CRM's **Contact & links** page, served at
`GET /v1/site/company`, and folded into every page (copy says `{{email}}`,
never the address itself).

The full contract — endpoints, shapes, what the backend fills in, the contact
form and the revalidation webhook — is in [docs/CONTENT_API.md](docs/CONTENT_API.md).
The mock files in `src/content/mock/` are a snapshot of the shipped copy for
working without a backend; they are not kept in step with the panel.

> The policies are drafts written from what the app and backend actually do.
> Have them reviewed by a lawyer before relying on them.

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
