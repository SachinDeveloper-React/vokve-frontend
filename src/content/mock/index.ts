/**
 * Mock content — what the site shows with no `VOKVE_CONTENT_API_URL`, for
 * working on the design without a backend. The real copy lives on the
 * backend now (`vokve-backend/src/modules/site/defaults`, edited on the
 * panel's Website pages, RULES P22); these are a snapshot of it and are not
 * kept in step. Each export matches one endpoint in docs/CONTENT_API.md and is
 * validated by the same schema as the real thing.
 */
import { privacyPolicy } from './legal/privacy';
import { termsAndConditions } from './legal/terms';
import { rewardsPolicy } from './legal/rewards';
import { refundPolicy, shippingPolicy } from './legal/commerce';

export { siteConfig } from './site';
export { siteCompany } from './company';
export { homePage } from './home';
export { aboutPage } from './about';
export { faqPage } from './faqs';
export { deletionGuide } from './deletion';
export { contactPage, legalIndex, licensesPage, invitePage } from './pages';

export const legalDocuments: Record<string, unknown> = {
  privacy: privacyPolicy,
  terms: termsAndConditions,
  'rewards-policy': rewardsPolicy,
  'refund-policy': refundPolicy,
  'shipping-policy': shippingPolicy,
};
