# Content API — what the backend serves

The website has **no words of its own**. Every page reads its content from the
backend, under one public prefix, and every word is edited on the panel's
**Website** pages (RULES P22):

```
GET {VOKVE_CONTENT_API_URL}/site/...        e.g. https://api.vokve.com/v1/site/config
```

With no API set the site reads the mock files in `src/content/mock/` — for
working on the design without a backend. The shapes are defined once, as zod
schemas, in [`src/lib/content/schemas.ts`](../src/lib/content/schemas.ts) —
that file is the contract. The backend keeps its own copy
(`vokve-backend/src/contracts/site.ts`) and holds every answer to it before
sending, and the panel's editor is drawn from the same shapes, so it cannot
save anything this site could not draw. Change one, change the other.

## Endpoints

All `GET`, public (no auth, no device headers), JSON, open during maintenance.
A `404` on a document makes that page a 404; any other non-2xx fails the read.

| Endpoint | Schema | Mock | Page(s) | Edited on the panel |
|---|---|---|---|---|
| `/site/config` | `siteConfigSchema` | `mock/site.ts` | every page (header, footer, SEO, labels) | Website › Header, footer & SEO |
| `/site/company` | `siteCompanySchema` | `mock/company.ts` | folded into every page (below) | System › Contact & links |
| `/site/pages/home` | `homePageSchema` | `mock/home.ts` | `/` | Website › Home |
| `/site/pages/about` | `aboutPageSchema` | `mock/about.ts` | `/about` | Website › About |
| `/site/legal` | `legalIndexSchema` | `mock/pages.ts` → `legalIndex` | `/legal`, `sitemap.xml`, the documents built ahead | Website › Legal hub (+ each document’s listing) |
| `/site/legal/:slug` | `legalDocumentSchema` | `mock/legal/*.ts` | `/:slug` — `/privacy`, `/terms`, … and any created later | Website › Documents |
| `/site/account-deletion` | `deletionGuideSchema` | `mock/deletion.ts` | `/delete-account` | Website › Delete your account |
| `/site/faqs` | `faqPageSchema` | `mock/faqs.ts` | `/faq` | Website › FAQ (frame) + Help centre (questions) |
| `/site/pages/contact` | `contactPageSchema` | `mock/pages.ts` → `contactPage` | `/contact` | Website › Contact |
| `/site/pages/licenses` | `licensesPageSchema` | `mock/pages.ts` → `licensesPage` | `/licenses` | Website › Open-source licences |
| `/site/pages/invite` | `invitePageSchema` | `mock/pages.ts` → `invitePage` | `/r/:code` (share links) | Website › Invite link |

And one write:

```
POST {VOKVE_API_URL or VOKVE_CONTENT_API_URL}/site/contact
```

The contact form (`app/contact/actions.ts`, a server action, so the API's
address never reaches the browser). Body: `name`, `email`, `phone?`,
`topic?`, `message`, `page?`. The message lands on the panel's
**Enquiries** page. Answers `201` (also for a message it quietly drops as a
bot's), `422` with field-by-field `details`, `429` when one visitor or one
address has sent too many. Because every request comes from this server, it
sends the visitor's address as `x-vokve-visitor-ip` with
`x-vokve-site-key: $CONTENT_REVALIDATE_SECRET`; without the secret the API
limits this server as one visitor. The form also has a hidden honeypot box
and drops anything sent faster than a person could type it. Its words —
labels, topics, the thank-you — are `contactPageSchema.form` (null hides it).

## Documents

Every published document is served at its own address by
`app/[slug]/page.tsx`: the ones the legal hub lists are built ahead, and one
created on the panel later is made on its first visit (`ensureStatic:
'navigation'`, so an address with nothing behind it answers a real 404, not a
200 page that says "not found"). The site's own pages (`/about`, `/faq`…)
are routes of their own and answer first; the backend refuses those
addresses for a document.

## What the backend fills in

The panel never asks for a second copy of something the backend already
knows. These arrive filled:

- **Contact details** — `GET /site/company` (⚙ `support.*`, `app.storeUrl`,
  `app.storeListed`, edited on Contact & links). The backend also folds them
  into `/site/config`, and this site overlays them again from `/site/company`
  so a config served from the mocks still shows the live details.
- **Figures** — tokens in any text, filled by the backend from ⚙ config:
  `{{graceDays}}`, `{{coinValue}}`, `{{dailyCoinCap}}`, `{{stepsCoinCap}}`,
  `{{coinExpiryDays}}`, `{{inviteReward}}`, `{{inviterReward}}`,
  `{{inviteWindowDays}}`, `{{deliveryDays}}`, `{{returnWindowDays}}`,
  `{{shippingFee}}`, `{{freeShippingAbove}}`, `{{challengeCount}}`; and the
  deletion guide's `graceDays` (⚙ `account.deletionGraceDays`).
- **FAQs** — `/site/faqs` items are the Help centre's active articles
  (`support_faqs`); the home page's questions are articles picked by id.
- **Challenges** — the home board is every running challenge
  (`challenge_definitions`) unless the panel switches the live board off.
- **The legal hub's list** — the published documents, in their own order,
  then the hub's extra links.

Tokens the *website* fills (from `/site/company`, `src/lib/content/details.ts`):
`{{email}}`, `{{phone}}` (E.164, for `tel:`), `{{phoneDisplay}}`,
`{{whatsapp}}`, `{{whatsappDisplay}}`, `{{whatsappLink}}`, `{{hours}}`,
`{{responseTime}}`, `{{company}}`, `{{grievanceEmail}}`, `{{grievanceName}}`,
`{{website}}`. Write `[{{email}}](mailto:{{email}})` in a policy, never the
address itself. A list entry (a contact channel) that needs a way of reaching
us that is not set — no phone, no WhatsApp — is left out; an empty
`{{hours}}` or `{{grievanceName}}` only empties its own value. Unknown
tokens are left as written — and the panel refuses to save one.

## The home page, as the current design draws it

- **Section labels are optional.** `eyebrow` on a section head, the hero and
  the download block may be `null`; when set it is a short section name
  ("How it works"), not a slogan.
- **The day line.** Each how-it-works step may carry `status: { text, state }`
  — `text` written the way the wallet writes a day (`Pending · +7.98 coins`),
  `state` one of `neutral`, `pending`, `paid` (unknown → `neutral`).
- **The fair-play chart.** `fairPlay.sample` is one illustrative day: a
  `title`, the `date` for the line under the chart, 24 hourly step counts in
  `hours`, the red `walk` hours as `{ from, to, label }` (`to` exclusive), a
  `stepsLabel` and a `status`. `null` hides the chart.
- **Challenges** are grouped on the board by `cadence`, in first-seen order,
  and each takes a Lucide `icon` (default `trophy`). The app's emoji are not
  sent or drawn. List every challenge in `challenge_definitions` so the board
  and the "9 challenges" figure agree.
- **The first feature leads**, drawn large; the rest are a list. `tone` and
  `span` on features and privacy points are accepted but no longer drawn.
- **`hero.trust`** shows as one quiet line under the numbers strip.
- **Shop copy follows D-109.** While there is no payment gateway the whole
  shop is paid in coins, delivery included, so the home page (step 4, the
  "Rewards shop" feature, the coin-value stat), the FAQ "How much can I pay
  with coins?", the Coins & Fair Play policy ("Spending coins"), the shipping
  policy (delivery charges), the terms ("The VOKVE shop") and the About
  milestone say so. When the gateway returns, those lines change with it —
  their mixed-payment figures come from ⚙ `commerce.paymentMode` and
  `commerce.coinShareMax`.

## Rules the shapes follow

- **Text is never HTML.** Legal and FAQ text allows two inline marks:
  `**bold**` and `[label](href)`. Links may be `/path`, `#anchor`, `https:`,
  `mailto:` or `tel:`; anything else renders as plain text.
- **Unknown names fall back, they don't break pages.** An icon name the site
  doesn't know draws a generic glyph; an unknown `tone` becomes `brand`; a
  legal block with an unknown `type` is skipped. Icon names are Lucide names in
  kebab-case — the list is in `src/components/ui/Icon.tsx`.
- **Everything else is strict.** A missing required field fails the read with
  a message naming the field (`ContentError`).
- **Dates** are ISO strings and are shown in IST, `en-IN` (e.g. 21 November 2026).

## Freshness

Each read is cached for an hour (`cacheLife('hours')`) and tagged. After every
save on the panel — and after a Help-centre article, a challenge or a
token figure changes — the backend refreshes at once:

```http
POST https://vokve.com/api/revalidate
Authorization: Bearer <CONTENT_REVALIDATE_SECRET>
Content-Type: application/json

{ "tags": ["site:legal", "site:legal:cookie-policy"], "immediate": true }
```

Tags: `site` (everything), `site:config`, `site:home`, `site:about`,
`site:legal`, `site:legal:<slug>`, `site:faq`, `site:contact`,
`site:deletion`, `site:licenses`, `site:invite`, `site:company` (every page
that shows a contact detail — which is every page). An empty body refreshes
everything. Without `CONTENT_REVALIDATE_SECRET` set, the route answers 404.
The panel's "Refresh the website now" sends `site`.

By default the next visitor is still served the old copy once while the new
one is made. `"immediate": true` — what the backend always sends — drops it
outright, so the next request waits for the fresh one. Without the backend's
`SITE_REVALIDATE_URL` (this route) and `SITE_REVALIDATE_SECRET` (this site's
`CONTENT_REVALIDATE_SECRET`) the site catches up within its hour.

A backend that is unreachable at **build** time fails the build (no silent
fallback to mock policies). At **runtime** the site keeps serving the last good
copy until the API answers again.
