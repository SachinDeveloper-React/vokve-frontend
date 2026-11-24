import type { z } from 'zod';
import type { siteCompanySchema } from '@/lib/content/schemas';

/**
 * MOCK — `GET /site/company`, as the backend answers it with nothing changed
 * on the CRM: the ⚙ `support.*` defaults. Set `VOKVE_API_URL` and the site
 * reads the real one instead (docs/CONTENT_API.md).
 */
export const siteCompany = {
  company: {
    legalName: 'VOKVE Fitness',
    email: 'support@vokve.com',
    phone: '+918000000000',
    whatsapp: null,
    hours: 'Mon–Sat, 9 am – 7 pm IST',
    responseTime: 'We usually reply within 24 hours.',
    address: ['VOKVE Fitness', 'India'],
    grievanceOfficer: { name: null, email: 'support@vokve.com' },
  },
  links: {
    website: 'https://vokve.com',
    privacy: 'https://vokve.com/privacy',
    terms: 'https://vokve.com/terms',
    licenses: 'https://vokve.com/licenses',
  },
  inviteUrlBase: 'https://vokve.com/r',
  stores: {
    android: { url: 'https://play.google.com/store/apps/details?id=com.vokve.fitness', listed: true },
    ios: { url: 'https://apps.apple.com/app/vokve', listed: false },
  },
  social: [],
} satisfies z.input<typeof siteCompanySchema>;
