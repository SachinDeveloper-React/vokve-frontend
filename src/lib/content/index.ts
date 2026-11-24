import 'server-only';
import { cacheLife, cacheTag } from 'next/cache';
import * as mock from '@/content/mock';
import {
  aboutPageSchema,
  contactPageSchema,
  deletionGuideSchema,
  faqPageSchema,
  homePageSchema,
  invitePageSchema,
  legalDocumentSchema,
  legalIndexSchema,
  licensesPageSchema,
  siteCompanySchema,
  siteConfigSchema,
  type SiteCompany,
} from './schemas';
import { detailTokens, fillDetails, overlaySiteConfig } from './details';
import { loadContent } from './source';

/**
 * Every read the site makes. Each is cached for an hour and tagged, so the
 * backend or the panel can refresh a page the moment it is edited by POSTing
 * the tag to `/api/revalidate` (see `CONTENT_TAGS`).
 */

export const CONTENT_TAGS = [
  'site',
  'site:config',
  'site:home',
  'site:about',
  'site:legal',
  'site:faq',
  'site:contact',
  'site:deletion',
  'site:licenses',
  'site:invite',
  'site:company',
] as const;
export type ContentTag = (typeof CONTENT_TAGS)[number];

/**
 * The live contact details (RULES P21) — served by the backend today and
 * edited on the CRM's Contact & links page. Every other read below folds
 * them in, so each is tagged `site:company` too: the backend refreshes
 * `site` after an edit, and this tag alone is enough to redo just these.
 */
export async function getCompany() {
  'use cache';
  cacheLife('hours');
  cacheTag('site', 'site:company');
  return loadContent('/company', siteCompanySchema, () => mock.siteCompany, { live: true });
}

/** Fills a page's `{{email}}`-style tokens from the live details before it is checked. */
const filled = (live: SiteCompany) => {
  const tokens = detailTokens(live);
  return (raw: unknown) => fillDetails(raw, tokens);
};

export async function getSiteConfig() {
  'use cache';
  cacheLife('hours');
  cacheTag('site', 'site:config', 'site:company');
  const live = await getCompany();
  const fill = filled(live);
  return loadContent('/config', siteConfigSchema, () => mock.siteConfig, {
    prepare: raw => fill(overlaySiteConfig(raw, live)),
  });
}

export async function getHomePage() {
  'use cache';
  cacheLife('hours');
  cacheTag('site', 'site:home', 'site:company');
  return loadContent('/pages/home', homePageSchema, () => mock.homePage, { prepare: filled(await getCompany()) });
}

export async function getAboutPage() {
  'use cache';
  cacheLife('hours');
  cacheTag('site', 'site:about', 'site:company');
  return loadContent('/pages/about', aboutPageSchema, () => mock.aboutPage, { prepare: filled(await getCompany()) });
}

export async function getLegalIndex() {
  'use cache';
  cacheLife('hours');
  cacheTag('site', 'site:legal', 'site:company');
  return loadContent('/legal', legalIndexSchema, () => mock.legalIndex, { prepare: filled(await getCompany()) });
}

/** Null when the backend has no document under that slug. */
export async function getLegalDocument(slug: string) {
  'use cache';
  cacheLife('hours');
  cacheTag('site', 'site:legal', `site:legal:${slug}`, 'site:company');
  return loadContent(
    `/legal/${encodeURIComponent(slug)}`,
    legalDocumentSchema,
    () => mock.legalDocuments[slug],
    { optional: true, prepare: filled(await getCompany()) },
  );
}

export async function getDeletionGuide() {
  'use cache';
  cacheLife('hours');
  cacheTag('site', 'site:deletion', 'site:company');
  return loadContent('/account-deletion', deletionGuideSchema, () => mock.deletionGuide, { prepare: filled(await getCompany()) });
}

export async function getFaqPage() {
  'use cache';
  cacheLife('hours');
  cacheTag('site', 'site:faq', 'site:company');
  return loadContent('/faqs', faqPageSchema, () => mock.faqPage, { prepare: filled(await getCompany()) });
}

export async function getContactPage() {
  'use cache';
  cacheLife('hours');
  cacheTag('site', 'site:contact', 'site:company');
  return loadContent('/pages/contact', contactPageSchema, () => mock.contactPage, { prepare: filled(await getCompany()) });
}

export async function getLicensesPage() {
  'use cache';
  cacheLife('hours');
  cacheTag('site', 'site:licenses', 'site:company');
  return loadContent('/pages/licenses', licensesPageSchema, () => mock.licensesPage, { prepare: filled(await getCompany()) });
}

export async function getInvitePage() {
  'use cache';
  cacheLife('hours');
  cacheTag('site', 'site:invite', 'site:company');
  return loadContent('/pages/invite', invitePageSchema, () => mock.invitePage, { prepare: filled(await getCompany()) });
}
