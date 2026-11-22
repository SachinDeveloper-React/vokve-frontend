/**
 * Formatting with a fixed locale and time zone, so the server and the
 * browser always produce the same string (no hydration mismatch) and every
 * date reads the way an Indian member expects.
 */
const dateFormat = new Intl.DateTimeFormat('en-IN', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  timeZone: 'Asia/Kolkata',
});

const numberFormat = new Intl.NumberFormat('en-IN');

export const formatDate = (iso: string) => dateFormat.format(new Date(iso));

export const formatNumber = (value: number) => numberFormat.format(value);

/** Fills `{name}` placeholders the backend leaves in a sentence. */
export const fill = (template: string, values: Record<string, string>) =>
  template.replace(/\{(\w+)\}/g, (match, key: string) => values[key] ?? match);

export const pad2 = (n: number) => String(n).padStart(2, '0');

export const cx = (...parts: (string | false | null | undefined)[]) => parts.filter(Boolean).join(' ');

/** Links the site will render. Anything else (javascript:, data:) is shown as text. */
export const isSafeHref = (href: string) =>
  href.startsWith('/') || href.startsWith('#') || /^(https?:|mailto:|tel:)/i.test(href);

export const isInternalHref = (href: string) => href.startsWith('/') || href.startsWith('#');
