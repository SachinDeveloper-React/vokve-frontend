/**
 * Mock content — what the site shows until `VOKVE_CONTENT_API_URL` points at
 * a backend that serves `/site/*`. Each export matches one endpoint in
 * docs/CONTENT_API.md and is validated by the same schema as the real thing.
 */
import { privacyPolicy } from './legal/privacy';
import { termsAndConditions } from './legal/terms';
import { rewardsPolicy } from './legal/rewards';
import { refundPolicy, shippingPolicy } from './legal/commerce';

export { siteConfig } from './site';
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
