# Content API — what the backend needs to serve

The website has **no words of its own**. Every page reads its content from the
backend, under one public prefix:

```
GET {VOKVE_CONTENT_API_URL}/site/...        e.g. https://api.vokve.app/v1/site/config
```

Until those routes exist, the site reads the mock files in `src/content/mock/`.
The shapes are defined once, as zod schemas, in
[`src/lib/content/schemas.ts`](../src/lib/content/schemas.ts) — that file is
the contract. Mocks are parsed through the same schemas, so each mock file is
also a correct example response for its endpoint.

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
- **Support email, phone, hours, reply-time promise** → ⚙ `support.*`.
- **Store links** → ⚙ `app.storeUrl` (note: its Android default still says
  `com.vokve`; the app's applicationId is `com.vokve.fitness`).
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
POST https://vokve.app/api/revalidate
Authorization: Bearer <CONTENT_REVALIDATE_SECRET>
Content-Type: application/json

{ "tags": ["site:legal"] }
```

Tags: `site` (everything), `site:config`, `site:home`, `site:about`,
`site:legal`, `site:legal:<slug>`, `site:faq`, `site:contact`,
`site:deletion`, `site:licenses`, `site:invite`. An empty body refreshes
everything. Without `CONTENT_REVALIDATE_SECRET` set, the route answers 404.

A backend that is unreachable at **build** time fails the build (no silent
fallback to mock policies). At **runtime** the site keeps serving the last good
copy until the API answers again.
