# Content API — what the backend needs to serve

The website has **no words of its own**. Every page reads its content from the
backend, under one public prefix:

```
GET {VOKVE_CONTENT_API_URL}/site/...        e.g. https://api.vokve.com/v1/site/config
```

Until those routes exist, the site reads the mock files in `src/content/mock/`.
The shapes are defined once, as zod schemas, in
[`src/lib/content/schemas.ts`](../src/lib/content/schemas.ts) — that file is
the contract. Mocks are parsed through the same schemas, so each mock file is
also a correct example response for its endpoint.

## Served today: the contact details

One endpoint is live on the backend already, because the CRM edits what it
returns (RULES P21, D-112):

```
GET {VOKVE_API_URL}/site/company           e.g. https://api.vokve.com/v1/site/company
```

`siteCompanySchema` · mock `mock/company.ts`. The support email, phone,
WhatsApp, hours, reply-time promise, company name and address, Grievance
Officer, the website/policy links, the invite-link base, both store links
(with whether each listing is live) and the social profiles — the same
⚙ `support.*` / `app.storeUrl` / `app.storeListed` the app's Help and About
screens read, edited on the CRM's **Contact & links** page.

Set `VOKVE_API_URL` and the site reads these live while every other page stays
on the mocks; with `VOKVE_CONTENT_API_URL` set they come from that base like
everything else. Either way they reach the pages in two ways
(`src/lib/content/details.ts`):

- **The site config is overlaid:** `company`, `stores` and `social` are the
  live ones; the copy keeps only its words around them (the officer's title,
  each store button's caption and its "Coming soon", shown while a listing is
  not live).
- **Tokens in any text are filled:** `{{email}}`, `{{phone}}` (E.164, for
  `tel:`), `{{phoneDisplay}}`, `{{whatsapp}}`, `{{whatsappDisplay}}`,
  `{{whatsappLink}}`, `{{hours}}`, `{{responseTime}}`, `{{company}}`,
  `{{grievanceEmail}}`, `{{grievanceName}}`, `{{website}}`. Write
  `[{{email}}](mailto:{{email}})` in a policy, never the address itself. A list
  entry (a contact channel) that needs a way of reaching us that is not set —
  no phone, no WhatsApp — is left out; an empty `{{hours}}` or
  `{{grievanceName}}` only empties its own value. Unknown tokens are left as
  written. A backend that serves these pages later can send the tokens as they
  are.

## Endpoints

All `GET`, public (no auth, no device headers), JSON. A `404` on a legal
document makes that page a 404; any other non-2xx fails the read.

| Endpoint | Schema | Mock | Page(s) |
|---|---|---|---|
| `/site/config` | `siteConfigSchema` | `mock/site.ts` | every page (header, footer, SEO, labels) |
| `/site/pages/home` | `homePageSchema` | `mock/home.ts` | `/` |
| `/site/pages/about` | `aboutPageSchema` | `mock/about.ts` | `/about` |
| `/site/legal` | `legalIndexSchema` | `mock/pages.ts` → `legalIndex` | `/legal`, `sitemap.xml` |
| `/site/legal/:slug` | `legalDocumentSchema` | `mock/legal/*.ts` | `/privacy`, `/terms`, `/rewards-policy`, `/refund-policy`, `/shipping-policy` |
| `/site/account-deletion` | `deletionGuideSchema` | `mock/deletion.ts` | `/delete-account` |
| `/site/faqs` | `faqPageSchema` | `mock/faqs.ts` | `/faq` |
| `/site/pages/contact` | `contactPageSchema` | `mock/pages.ts` → `contactPage` | `/contact` |
| `/site/pages/licenses` | `licensesPageSchema` | `mock/pages.ts` → `licensesPage` | `/licenses` |
| `/site/pages/invite` | `invitePageSchema` | `mock/pages.ts` → `invitePage` | `/r/:code` (share links) |

## Where the backend should take each value from

Most of this already exists in the backend — the site should read it, not get
a second copy typed into a panel:

- **FAQs** → the `support_faqs` collection (active rows, `sort` order). The
  mock is a copy of the seed in `vokve-backend/src/seed/data.ts`.
- **Support email, phone, hours, reply-time promise, address, social, store
  links** → already served by `GET /site/company` (above) and folded into every
  page; `/site/config` needs no copy of them.
- **Store links** → ⚙ `app.storeUrl` + `app.storeListed`, via `/site/company`.
- **Deletion grace days** (`graceDays`, and the "14 days" in the copy) →
  ⚙ `account.deletionGraceDays`.
- **Coin figures in the Coins & Fair Play policy** → ⚙ `coins.*`,
  `trust.holdHours`, `leaderboard.tiers`, `commerce.coinValuePaise`,
  `commerce.coinShareMax`.
- **Shipping and refund figures** → ⚙ `commerce.shippingFeePaise`,
  `freeShippingAbovePaise`, `deliveryDaysMin/Max`, `returnWindowDays`,
  `paymentWindowMinutes`.
- **Invite reward and code shape** → ⚙ `coins.referral.invitee`; the code
  alphabet/length from `social/service.ts` (RULES F1).
- **Challenges on the home page** → `challenge_definitions`.

Everything else (marketing copy, policy text) is new content — a natural
next step is a "Website" section in the CRM that edits it.

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

Each read is cached for an hour (`cacheLife('hours')`) and tagged. After an
edit, the backend or CRM can refresh immediately:

```http
POST https://vokve.com/api/revalidate
Authorization: Bearer <CONTENT_REVALIDATE_SECRET>
Content-Type: application/json

{ "tags": ["site:legal"] }
```

Tags: `site` (everything), `site:config`, `site:home`, `site:about`,
`site:legal`, `site:legal:<slug>`, `site:faq`, `site:contact`,
`site:deletion`, `site:licenses`, `site:invite`, `site:company` (every page
that shows a contact detail — which is every page). An empty body refreshes
everything. Without `CONTENT_REVALIDATE_SECRET` set, the route answers 404.

By default the next visitor is still served the old copy once while the new
one is made. `"immediate": true` drops it outright, so the next request waits
for the fresh one. The backend sends `{ "tags": ["site:company"], "immediate":
true }` after every contact-detail change, when its `SITE_REVALIDATE_URL`
(this route) and `SITE_REVALIDATE_SECRET` (this site's
`CONTENT_REVALIDATE_SECRET`) are set.

A backend that is unreachable at **build** time fails the build (no silent
fallback to mock policies). At **runtime** the site keeps serving the last good
copy until the API answers again.
