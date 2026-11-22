/**
 * The content contract between this site and the VOKVE backend.
 *
 * Every word and number the site shows arrives through one of these shapes,
 * from `GET {VOKVE_CONTENT_API_URL}/site/...` — or, until the backend serves
 * those routes, from the mock files in `src/content/mock`, which are parsed
 * through the very same schemas so they cannot drift from the contract.
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

/** The colour family a tile glows in. Unknown tones fall back to the brand. */
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
  eyebrow: z.string(),
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

// ─── GET /site/pages/home ───────────────────────────────────────────────────

const statSchema = z.object({ value: z.string().min(1), label: z.string().min(1) });

export const homePageSchema = z.object({
  seo: seoSchema,
  hero: z.object({
    eyebrow: z.string(),
    /** `title` is shown with `highlight` (a substring of it) lit in the brand gradient. */
    title: z.string().min(1),
    highlight: z.string().nullable(),
    subtitle: z.string(),
    primaryCta: linkSchema,
    secondaryCta: linkSchema.nullable(),
    trust: z.array(z.string()),
    /** The numbers in the floating windows beside the headline. */
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
    steps: z.array(z.object({ icon: iconName, title: z.string(), body: z.string() })),
  }),
  features: sectionHead.extend({
    items: z.array(
      z.object({
        icon: iconName,
        title: z.string(),
        body: z.string(),
        tone: toneSchema,
        span: z.enum(['wide', 'regular']).catch('regular'),
      }),
    ),
  }),
  challenges: sectionHead.extend({
    items: z.array(
      z.object({
        id: z.string(),
        emoji: z.string(),
        title: z.string(),
        description: z.string(),
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
  }),
  privacy: sectionHead.extend({
    points: z.array(
      z.object({
        icon: iconName,
        tone: toneSchema,
        title: z.string(),
        body: z.string(),
        link: linkSchema.nullable(),
      }),
    ),
  }),
  faq: sectionHead.extend({ items: z.array(faqItemSchema), cta: linkSchema }),
  download: z.object({
    eyebrow: z.string(),
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
});
export type ContactPage = z.infer<typeof contactPageSchema>;

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
