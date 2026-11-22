# vokve-frontend — the VOKVE website

The public site at vokve.app: home, about, FAQ, contact, the legal documents
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
```

The full contract — endpoints, shapes, which backend config each value should
come from, and the revalidation webhook — is in
[docs/CONTENT_API.md](docs/CONTENT_API.md).

> The legal texts in `src/content/mock/legal/` are drafts written from what the
> app and backend actually do. Have them reviewed before publishing.

## Design: spatial UI

The page is a lit room with frosted-glass windows floating at different depths
(`src/app/globals.css`):

- `.glass` (window), `.glass-ornament` (floating pill — nav, chips), `.well`
  (recessed area), `.icon-orb` (glossy icon tile, coloured by `data-tone`).
- `data-specular` / `data-tilt` on a surface give it a pointer-following light
  and a lean toward the pointer (one listener: `PointerLight`).
- `SpatialStage` tilts a 3D scene with the pointer; children with `.layer` and
  `--z` sit at their own depths (hero, fair-play stack, download icon).
- Light and dark follow the system; the toggle stores a choice in
  `localStorage` and an inline script applies it before first paint.
- Reduced motion, touch screens, print and browsers without
  `backdrop-filter` all get flat, readable panels.

## Layout

```
src/app/                 routes (one folder per page), sitemap, robots, OG image, /api/revalidate
src/components/home/     home page sections and the hero scene
src/components/legal/    the shared legal-document layout
src/components/ui/       server components: icons, logo, links, rich text, headings
src/components/client/   the only client code: nav, theme toggle, pointer light, stage, FAQ search, TOC, copy
src/lib/content/         schemas (the contract), the loader, and cached getters
src/content/mock/        mock responses, one per endpoint
```
# vokve-frontend
