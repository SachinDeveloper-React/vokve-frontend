import type { SiteCompany } from './schemas';

/**
 * The live contact details in every page (RULES P21).
 *
 * The CRM's Contact & links page edits the support email, the numbers, the
 * address and the store links, and the backend serves them at
 * `GET /site/company`. Two things put them on the site:
 *
 * 1. **The site config is overlaid** — `company`, `stores` and `social` are
 *    replaced by the live ones, keeping only the copy around them (the
 *    Grievance Officer's title, the store buttons' words).
 * 2. **Every other page's text is filled.** Content may say `{{email}}`,
 *    `{{phone}}` and the rest of `detailTokens` instead of a fixed address,
 *    and the live value goes in. Two rules keep an empty detail from
 *    leaving a hole:
 *      - an entry in a list that needs a way of reaching us that is not
 *        set — no phone, no WhatsApp — is left out (the phone channel when
 *        there is no number), as the app's help page drops that row;
 *      - an extra that is empty (`{{hours}}` when support is always open,
 *        `{{grievanceName}}`) only empties its own value: a value that is
 *        just that token becomes null, and inside text it is left out.
 *    A token the site does not know is left exactly as written.
 */

export type DetailTokens = Record<string, string | null>;

const TOKEN = /\{\{([a-zA-Z]+)\}\}/g;
const WHOLE_TOKEN = /^\{\{([a-zA-Z]+)\}\}$/;

/** Details that describe rather than reach: empty, they blank their own value and nothing more. */
const EXTRAS = new Set(['hours', 'grievanceName']);

/** `+919876543210` → `+91 98765 43210`; any other country is shown as stored. */
export function formatPhone(e164: string): string {
  const india = /^\+91([6-9]\d{4})(\d{5})$/.exec(e164);
  return india ? `+91 ${india[1]} ${india[2]}` : e164;
}

/** Every token content may use, and what it stands for. */
export function detailTokens(live: SiteCompany): DetailTokens {
  const { company } = live;
  return {
    email: company.email,
    phone: company.phone,
    phoneDisplay: company.phone ? formatPhone(company.phone) : null,
    whatsapp: company.whatsapp,
    whatsappDisplay: company.whatsapp ? formatPhone(company.whatsapp) : null,
    whatsappLink: company.whatsapp ? `https://wa.me/${company.whatsapp.replace(/\D/g, '')}` : null,
    hours: company.hours,
    responseTime: company.responseTime,
    company: company.legalName,
    grievanceEmail: company.grievanceOfficer.email,
    grievanceName: company.grievanceOfficer.name,
    website: live.links.website,
  };
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  value !== null && typeof value === 'object' && !Array.isArray(value);

/** Whether anything in `value` needs a way of reaching us that is not set. */
function leansOnEmpty(value: unknown, tokens: DetailTokens): boolean {
  if (typeof value === 'string') {
    for (const [, name] of value.matchAll(TOKEN)) {
      if (!EXTRAS.has(name) && name in tokens && tokens[name] === null) return true;
    }
    return false;
  }
  if (Array.isArray(value)) return value.some(item => leansOnEmpty(item, tokens));
  if (isRecord(value)) return Object.values(value).some(item => leansOnEmpty(item, tokens));
  return false;
}

function fillString(text: string, tokens: DetailTokens): string | null {
  const whole = WHOLE_TOKEN.exec(text);
  if (whole && whole[1] in tokens) return tokens[whole[1]];
  return text.replace(TOKEN, (match, name: string) => (name in tokens ? (tokens[name] ?? '') : match));
}

/** Content with its `{{tokens}}` filled from the live details. */
export function fillDetails(value: unknown, tokens: DetailTokens): unknown {
  if (typeof value === 'string') return fillString(value, tokens);
  if (Array.isArray(value)) {
    return value
      .filter(item => !(isRecord(item) && leansOnEmpty(item, tokens)))
      .map(item => fillDetails(item, tokens));
  }
  if (isRecord(value)) {
    return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, fillDetails(item, tokens)]));
  }
  return value;
}

const SOCIAL_LABELS: Record<SiteCompany['social'][number]['kind'], string> = {
  instagram: 'Instagram',
  facebook: 'Facebook',
  x: 'X',
  youtube: 'YouTube',
  linkedin: 'LinkedIn',
};

/**
 * The site config with the live details in place of the copy's own. The
 * copy keeps its words — the officer's title, each store button's caption,
 * label and "Coming soon" — and a store that is not listed yet has no link,
 * which is what makes its button say so.
 */
export function overlaySiteConfig(raw: unknown, live: SiteCompany): unknown {
  if (!isRecord(raw)) return raw;
  const copyCompany = isRecord(raw.company) ? raw.company : {};
  const copyOfficer = isRecord(copyCompany.grievanceOfficer) ? copyCompany.grievanceOfficer : null;
  const copyStores = isRecord(raw.stores) ? raw.stores : {};
  const store = (platform: 'android' | 'ios') => {
    const copy = isRecord(copyStores[platform]) ? copyStores[platform] : {};
    const own = live.stores[platform];
    return { ...copy, url: own.listed ? own.url : null };
  };

  return {
    ...raw,
    company: {
      ...copyCompany,
      legalName: live.company.legalName,
      email: live.company.email,
      phone: live.company.phone,
      whatsapp: live.company.whatsapp,
      hours: live.company.hours,
      responseTime: live.company.responseTime,
      address: live.company.address,
      grievanceOfficer: copyOfficer
        ? { ...copyOfficer, name: live.company.grievanceOfficer.name, email: live.company.grievanceOfficer.email }
        : null,
    },
    stores: { android: store('android'), ios: store('ios') },
    social: live.social.map(entry => ({ ...entry, label: SOCIAL_LABELS[entry.kind] })),
  };
}
