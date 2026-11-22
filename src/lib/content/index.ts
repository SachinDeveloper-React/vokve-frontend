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
  siteConfigSchema,
} from './schemas';
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
] as const;
export type ContentTag = (typeof CONTENT_TAGS)[number];

export async function getSiteConfig() {
  'use cache';
  cacheLife('hours');
  cacheTag('site', 'site:config');
  return loadContent('/config', siteConfigSchema, () => mock.siteConfig);
}

export async function getHomePage() {
  'use cache';
  cacheLife('hours');
  cacheTag('site', 'site:home');
  return loadContent('/pages/home', homePageSchema, () => mock.homePage);
}

export async function getAboutPage() {
  'use cache';
  cacheLife('hours');
  cacheTag('site', 'site:about');
  return loadContent('/pages/about', aboutPageSchema, () => mock.aboutPage);
}

export async function getLegalIndex() {
  'use cache';
  cacheLife('hours');
  cacheTag('site', 'site:legal');
  return loadContent('/legal', legalIndexSchema, () => mock.legalIndex);
}

/** Null when the backend has no document under that slug. */
export async function getLegalDocument(slug: string) {
  'use cache';
  cacheLife('hours');
  cacheTag('site', 'site:legal', `site:legal:${slug}`);
  return loadContent(
    `/legal/${encodeURIComponent(slug)}`,
    legalDocumentSchema,
    () => mock.legalDocuments[slug],
    { optional: true },
  );
}

export async function getDeletionGuide() {
  'use cache';
  cacheLife('hours');
  cacheTag('site', 'site:deletion');
  return loadContent('/account-deletion', deletionGuideSchema, () => mock.deletionGuide);
}

export async function getFaqPage() {
  'use cache';
  cacheLife('hours');
  cacheTag('site', 'site:faq');
  return loadContent('/faqs', faqPageSchema, () => mock.faqPage);
}

export async function getContactPage() {
  'use cache';
  cacheLife('hours');
  cacheTag('site', 'site:contact');
  return loadContent('/pages/contact', contactPageSchema, () => mock.contactPage);
}

export async function getLicensesPage() {
  'use cache';
  cacheLife('hours');
  cacheTag('site', 'site:licenses');
  return loadContent('/pages/licenses', licensesPageSchema, () => mock.licensesPage);
}

export async function getInvitePage() {
  'use cache';
  cacheLife('hours');
  cacheTag('site', 'site:invite');
  return loadContent('/pages/invite', invitePageSchema, () => mock.invitePage);
}
