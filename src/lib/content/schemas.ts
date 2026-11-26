/**
 * The content contract between this site and the VOKVE backend.
 *
 * Every word and number the site shows arrives through one of these shapes,
 * from `GET {VOKVE_CONTENT_API_URL}/site/...` — served by the backend and
 * edited on the panel's Website pages (RULES P22) — or, with no API set, from
 * the mock files in `src/content/mock`, which are parsed through the very
 * same schemas so they cannot drift from the contract. The backend holds its
 * own copy of these shapes (`vokve-backend/src/contracts/site.ts`) and checks
 * every answer against it before it is sent.
 *
 * Two rules shape it, both borrowed from how the app reads its config:
 *
 * - **A name the site cannot draw falls back; it never blanks a page.** Icons
 *   and tones are plain strings mapped on render (unknown → a neutral glyph),
 *   and a legal block of a type this build does not know is dropped rather
 *   than failing the whole document. So the backend can add a block type or
 *   an icon before the site is redeployed.
 * - **Everything else is strict.** A missing title or a malformed URL fails
 *   loudly at build/revalidate time, where it is cheap, instead of shipping
 *   an empty heading.
 */
import { z } from 'zod';

// ─── Shared pieces ──────────────────────────────────────────────────────────

/** An internal path (`/privacy`, `/#features`) or an absolute/mailto/tel URL. */
const href = z
  .string()
  .min(1)
  .refine(
    v => v.startsWith('/') || v.startsWith('#') || /^(https?:|mailto:|tel:)/.test(v),
    'must be a path, #anchor, http(s), mailto: or tel: link',
  );

const isoDate = z.string().refine(v => !Number.isNaN(Date.parse(v)), 'must be an ISO date');

/** Lucide icon name in kebab-case; unknown names render a fallback glyph. */
const iconName = z.string().min(1);

/**
 * A colour family some content still names. The current design draws every
 * icon in the text colour, so tones are accepted but not shown; unknown
 * tones fall back to the brand.
 */
export const toneSchema = z
  .enum(['brand', 'orange', 'blue', 'violet', 'gold', 'green', 'cyan', 'pink'])
  .catch('brand');
export type Tone = z.infer<typeof toneSchema>;

export const linkSchema = z.object({ label: z.string().min(1), href });
export type ContentLink = z.infer<typeof linkSchema>;

export const seoSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
});

const sectionHead = z.object({
  /** The short section name above the title ("How it works"); null for none. */
  eyebrow: z.string().nullable(),
  title: z.string().min(1),
  subtitle: z.string().nullable(),
});

export const faqItemSchema = z.object({
  id: z.string().min(1),
  category: z.string().min(1),
  question: z.string().min(1),
  answer: z.string().min(1),
  tags: z.array(z.string()).default([]),
});
export type FaqItem = z.infer<typeof faqItemSchema>;

// ─── GET /site/config — every page's frame ──────────────────────────────────

const storeSchema = z.object({
  /** Null while the listing is not live; the button then shows `note`. */
  url: z.url().nullable(),
  label: z.string().min(1),
  caption: z.string().min(1),
  note: z.string().nullable(),
});

export const siteConfigSchema = z.object({
  brand: z.object({
    name: z.string().min(1),
    tagline: z.string().min(1),
    description: z.string().min(1),
  }),
  seo: z.object({
    siteUrl: z.url(),
    titleTemplate: z.string().includes('%s'),
    defaultTitle: z.string().min(1),
    description: z.string().min(1),
    keywords: z.array(z.string()),
  }),
  company: z.object({
    legalName: z.string().min(1),
    email: z.email(),
    phone: z.string().nullable(),
    whatsapp: z.string().nullable(),
    hours: z.string().nullable(),
    responseTime: z.string().nullable(),
    address: z.array(z.string()),
    grievanceOfficer: z
      .object({ title: z.string(), name: z.string().nullable(), email: z.email() })
      .nullable(),
  }),
  stores: z.object({ android: storeSchema, ios: storeSchema }),
  announcement: z
    .object({ badge: z.string().nullable(), text: z.string().min(1), link: linkSchema.nullable() })
    .nullable(),
  nav: z.array(linkSchema).min(1),
  headerCta: linkSchema,
  footer: z.object({
    blurb: z.string(),
    columns: z.array(z.object({ title: z.string(), links: z.array(linkSchema) })),
    copyright: z.string(),
    disclaimer: z.string().nullable(),
  }),
  social: z.array(
    z.object({
      kind: z.enum(['instagram', 'x', 'youtube', 'linkedin', 'facebook']),
      url: z.url(),
      label: z.string(),
    }),
  ),
  /** The small words of the chrome, so the backend owns those too. */
  labels: z.object({
    skipToContent: z.string(),
    menu: z.string(),
    close: z.string(),
    themeToggle: z.string(),
    onThisPage: z.string(),
    lastUpdated: z.string(),
    effectiveFrom: z.string(),
    version: z.string(),
    shortVersion: z.string(),
    searchPlaceholder: z.string(),
    allCategories: z.string(),
    noResults: z.string(),
    copy: z.string(),
    copied: z.string(),
    readMore: z.string(),
    notFoundTitle: z.string(),
    notFoundBody: z.string(),
    backHome: z.string(),
    questionsTitle: z.string(),
    questionsBody: z.string(),
  }),
});
export type SiteConfig = z.infer<typeof siteConfigSchema>;

// ─── GET /site/company — the live contact details (served today) ───────────

const liveStoreSchema = z.object({ url: z.url(), listed: z.boolean() });

/**
 * The company's contact details and links, edited on the CRM's Contact &
 * links page and served by the backend now (`GET /v1/site/company`, RULES
 * P21) — the same ⚙ `support.*` the app's Help and About screens read. It
 * overlays `company`, `stores` and `social` in the site config, and fills the
 * `{{email}}`-style tokens in every page's text (`lib/content/details.ts`),
 * so an address changed on the panel changes on every page.
 */
export const siteCompanySchema = z.object({
  company: z.object({
    legalName: z.string().min(1),
    email: z.email(),
    phone: z.string().nullable(),
    whatsapp: z.string().nullable(),
    hours: z.string().nullable(),
    responseTime: z.string().min(1),
    address: z.array(z.string()),
    grievanceOfficer: z.object({ name: z.string().nullable(), email: z.email() }),
  }),
  links: z.object({
    website: z.url(),
    privacy: z.url(),
    terms: z.url(),
    licenses: z.url(),
  }),
  inviteUrlBase: z.url(),
  stores: z.object({ android: liveStoreSchema, ios: liveStoreSchema }),
  social: z.array(
    z.object({ kind: z.enum(['instagram', 'facebook', 'x', 'youtube', 'linkedin']), url: z.url() }),
  ),
});
export type SiteCompany = z.infer<typeof siteCompanySchema>;

// ─── GET /site/pages/home ───────────────────────────────────────────────────

const statSchema = z.object({ value: z.string().min(1), label: z.string().min(1) });

/**
 * A day as the wallet writes it — "Today · 8,432 steps · +7.98 coins" — with
 * the state its coins are in, drawn as a dot: grey, amber or green.
 */
const dayStatusSchema = z.object({
  text: z.string().min(1),
  state: z.enum(['neutral', 'pending', 'paid']).catch('neutral'),
});

/** One illustrative day of steps, hour by hour, for the fair-play chart. */
const daySampleSchema = z.object({
  /** The chart's title, e.g. "One day of walking, hour by hour". */
  title: z.string().min(1),
  /** The day in the line under the chart, e.g. "Tue 17 Nov". */
  date: z.string().min(1),
  /** Steps in each hour, 00:00 to 23:00. */
  hours: z.array(z.number().int().nonnegative()).length(24),
  /** The hours drawn in red: [from, to). */
  walk: z
    .object({ from: z.number().int().min(0).max(23), to: z.number().int().min(1).max(24), label: z.string() })
    .refine(w => w.to > w.from, 'walk.to must be after walk.from'),
  stepsLabel: z.string(),
  status: dayStatusSchema,
});

export const homePageSchema = z.object({
  seo: seoSchema,
  hero: z.object({
    eyebrow: z.string().nullable(),
    /** `title` is shown with `highlight` (a substring of it) set in the brand red. */
    title: z.string().min(1),
    highlight: z.string().nullable(),
    subtitle: z.string(),
    primaryCta: linkSchema,
    secondaryCta: linkSchema.nullable(),
    /** Short promises, shown as one quiet line under the numbers strip. */
    trust: z.array(z.string()),
    /** The numbers in the "Today" card beside the headline. */
    scene: z.object({
      dayLabel: z.string(),
      verifiedLabel: z.string(),
      steps: z.number().int().nonnegative(),
      goal: z.number().int().positive(),
      stepsLabel: z.string(),
      goalLabel: z.string(),
      metrics: z.array(z.object({ icon: iconName, value: z.string(), label: z.string() })).max(3),
      streak: z.object({ value: z.string(), label: z.string() }),
      challenge: z.object({
        title: z.string(),
        progress: z.number().min(0).max(1),
        reward: z.string(),
      }),
      rank: z.object({ value: z.string(), label: z.string() }),
      coin: z.object({ value: z.string(), label: z.string() }),
    }),
  }),
  stats: z.array(statSchema),
  howItWorks: sectionHead.extend({
    steps: z.array(
      z.object({
        icon: iconName,
        title: z.string(),
        body: z.string(),
        /** Where one day's coins are at this step, in the day-line format. */
        status: dayStatusSchema.nullable().default(null),
      }),
    ),
  }),
  features: sectionHead.extend({
    /** The first item leads, drawn large; the rest follow as a list. */
    items: z.array(
      z.object({
        icon: iconName,
        title: z.string(),
        body: z.string(),
        tone: toneSchema.optional(),
        span: z.enum(['wide', 'regular']).catch('regular').optional(),
      }),
    ),
  }),
  challenges: sectionHead.extend({
    items: z.array(
      z.object({
        id: z.string(),
        /** A line icon; the app's emoji are not drawn on the site. */
        icon: iconName.default('trophy'),
        title: z.string(),
        description: z.string(),
        /** Groups the board: items with the same cadence sit together, in first-seen order. */
        cadence: z.string(),
        rewardLabel: z.string(),
        badgeLabel: z.string().nullable(),
      }),
    ),
    note: z.string().nullable(),
  }),
  fairPlay: sectionHead.extend({
    layers: z.array(z.object({ icon: iconName, title: z.string(), body: z.string() })),
    note: z.string().nullable(),
    /** The chart beside the layers; null hides it. */
    sample: daySampleSchema.nullable().default(null),
  }),
  privacy: sectionHead.extend({
    points: z.array(
      z.object({
        icon: iconName,
        tone: toneSchema.optional(),
        title: z.string(),
        body: z.string(),
        link: linkSchema.nullable(),
      }),
    ),
  }),
  faq: sectionHead.extend({ items: z.array(faqItemSchema), cta: linkSchema }),
  download: z.object({
    eyebrow: z.string().nullable(),
    title: z.string(),
    subtitle: z.string(),
    note: z.string().nullable(),
  }),
});
export type HomePage = z.infer<typeof homePageSchema>;

// ─── GET /site/pages/about ──────────────────────────────────────────────────

export const aboutPageSchema = z.object({
  seo: seoSchema,
  hero: sectionHead,
  story: z.object({
    eyebrow: z.string(),
    title: z.string(),
    paragraphs: z.array(z.string()).min(1),
    quote: z.object({ text: z.string(), attribution: z.string() }).nullable(),
  }),
  numbers: z.array(statSchema),
  values: sectionHead.extend({
    items: z.array(
      z.object({ icon: iconName, tone: toneSchema, title: z.string(), body: z.string() }),
    ),
  }),
  milestones: sectionHead.extend({
    items: z.array(z.object({ when: z.string(), title: z.string(), body: z.string() })),
  }),
  team: sectionHead
    .extend({
      members: z.array(
        z.object({ name: z.string(), role: z.string(), photoUrl: z.url().nullable() }),
      ),
    })
    .nullable(),
  cta: z.object({
    title: z.string(),
    body: z.string(),
    primary: linkSchema,
    secondary: linkSchema.nullable(),
  }),
});
export type AboutPage = z.infer<typeof aboutPageSchema>;

// ─── GET /site/legal and /site/legal/:slug ──────────────────────────────────

/**
 * Block text is plain text with two inline marks: `**bold**` and
 * `[label](href)`. Never HTML — the site renders it as React text, so a
 * policy edited in the panel cannot inject markup into the page.
 */
const paragraphBlock = z.object({ type: z.literal('paragraph'), text: z.string() });
const listBlock = z.object({
  type: z.literal('list'),
  style: z.enum(['bullet', 'number']).catch('bullet'),
  items: z.array(z.string()).min(1),
});
const calloutBlock = z.object({
  type: z.literal('callout'),
  tone: z.enum(['info', 'warning', 'success']).catch('info'),
  title: z.string().nullable(),
  text: z.string(),
});
const tableBlock = z.object({
  type: z.literal('table'),
  columns: z.array(z.string()).min(1),
  rows: z.array(z.array(z.string())),
});
const definitionsBlock = z.object({
  type: z.literal('definitions'),
  items: z.array(z.object({ term: z.string(), description: z.string() })),
});

export const legalBlockSchema = z.discriminatedUnion('type', [
  paragraphBlock,
  listBlock,
  calloutBlock,
  tableBlock,
  definitionsBlock,
]);
export type LegalBlock = z.infer<typeof legalBlockSchema>;

/** Unknown or malformed blocks are dropped, so one bad block cannot take a policy down. */
const lenientBlocks = z.array(z.unknown()).transform(items =>
  items.flatMap(item => {
    const parsed = legalBlockSchema.safeParse(item);
    return parsed.success ? [parsed.data] : [];
  }),
);

export const legalDocumentSchema = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/),
  title: z.string().min(1),
  eyebrow: z.string(),
  summary: z.string(),
  version: z.string(),
  effectiveAt: isoDate,
  updatedAt: isoDate,
  highlights: z.array(z.string()),
  sections: z
    .array(
      z.object({
        id: z.string().regex(/^[a-z0-9-]+$/),
        title: z.string().min(1),
        blocks: lenientBlocks,
      }),
    )
    .min(1),
});
export type LegalDocument = z.infer<typeof legalDocumentSchema>;

export const legalIndexSchema = z.object({
  seo: seoSchema,
  hero: sectionHead,
  documents: z.array(
    z.object({
      slug: z.string(),
      title: z.string(),
      summary: z.string(),
      href,
      icon: iconName,
      updatedAt: isoDate,
    }),
  ),
});
export type LegalIndex = z.infer<typeof legalIndexSchema>;

// ─── GET /site/account-deletion ─────────────────────────────────────────────

export const deletionGuideSchema = z.object({
  seo: seoSchema,
  hero: sectionHead,
  updatedAt: isoDate,
  graceDays: z.number().int().positive(),
  timeline: z.array(z.object({ label: z.string(), title: z.string(), body: z.string() })),
  inApp: z.object({
    title: z.string(),
    subtitle: z.string().nullable(),
    path: z.array(z.string()).min(1),
    steps: z.array(z.object({ title: z.string(), body: z.string() })).min(1),
  }),
  confirmation: z.object({
    title: z.string(),
    items: z.array(z.object({ icon: iconName, title: z.string(), body: z.string() })),
  }),
  erased: z.object({ title: z.string(), items: z.array(z.string()) }),
  retained: z.object({
    title: z.string(),
    items: z.array(z.object({ item: z.string(), reason: z.string() })),
  }),
  noAccess: z.object({
    title: z.string(),
    body: z.string(),
    email: z.email(),
    subject: z.string(),
    bodyTemplate: z.string(),
    buttonLabel: z.string(),
    note: z.string().nullable(),
  }),
  export: z.object({ title: z.string(), body: z.string(), path: z.array(z.string()) }),
  faqTitle: z.string(),
  faqs: z.array(faqItemSchema),
});
export type DeletionGuide = z.infer<typeof deletionGuideSchema>;

// ─── GET /site/faqs ─────────────────────────────────────────────────────────

export const faqPageSchema = z.object({
  seo: seoSchema,
  hero: sectionHead,
  categories: z.array(z.object({ id: z.string(), title: z.string(), icon: iconName })),
  items: z.array(faqItemSchema),
  contact: z.object({ title: z.string(), body: z.string(), link: linkSchema }),
});
export type FaqPage = z.infer<typeof faqPageSchema>;

// ─── GET /site/pages/contact ────────────────────────────────────────────────

export const contactPageSchema = z.object({
  seo: seoSchema,
  hero: sectionHead,
  /** Ready-made links (mailto:, tel:, https://wa.me/…), like the app's help centre (P12). */
  channels: z.array(
    z.object({
      icon: iconName,
      tone: toneSchema,
      title: z.string(),
      value: z.string(),
      href: href.nullable(),
      note: z.string().nullable(),
    }),
  ),
  inApp: z.object({ title: z.string(), body: z.string(), path: z.array(z.string()) }),
  companyTitle: z.string(),
  grievanceNote: z.string().nullable(),
  /**
   * The contact form's words (RULES P22). Its messages go to the backend's
   * `POST /site/contact` and land on the panel's Enquiries page. Null — or a
   * backend from before the form — leaves the form out.
   */
  form: z
    .object({
      title: z.string().min(1),
      subtitle: z.string().nullable(),
      nameLabel: z.string().min(1),
      emailLabel: z.string().min(1),
      /** Null leaves the phone box out. */
      phoneLabel: z.string().nullable(),
      topicLabel: z.string().min(1),
      topics: z.array(z.string().min(1)).min(1),
      messageLabel: z.string().min(1),
      messagePlaceholder: z.string().nullable(),
      /** Small print under the button; inline marks allowed. */
      consent: z.string().nullable(),
      submitLabel: z.string().min(1),
      sendingLabel: z.string().min(1),
      successTitle: z.string().min(1),
      successBody: z.string(),
      errorBody: z.string(),
      rateLimitedBody: z.string(),
    })
    .nullable()
    .default(null),
});
export type ContactPage = z.infer<typeof contactPageSchema>;
export type ContactFormCopy = NonNullable<ContactPage['form']>;

// ─── GET /site/pages/licenses ───────────────────────────────────────────────

export const licensesPageSchema = z.object({
  seo: seoSchema,
  hero: sectionHead,
  intro: z.string(),
  packages: z.array(
    z.object({
      name: z.string(),
      version: z.string(),
      license: z.string(),
      url: z.url().nullable(),
    }),
  ),
});
export type LicensesPage = z.infer<typeof licensesPageSchema>;

// ─── GET /site/pages/invite ─────────────────────────────────────────────────

export const invitePageSchema = z.object({
  seo: seoSchema,
  hero: sectionHead,
  reward: z.object({ value: z.string(), label: z.string() }),
  codeLabel: z.string(),
  steps: z.array(z.object({ title: z.string(), body: z.string() })),
  invalid: z.object({ title: z.string(), body: z.string() }),
  /** The shape a code must have, so a mangled link is caught before the store. */
  codePattern: z.string(),
});
export type InvitePage = z.infer<typeof invitePageSchema>;
