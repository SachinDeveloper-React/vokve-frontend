'use server';

import { headers } from 'next/headers';
import { backendBase } from '@/lib/content/source';

/**
 * Sends the contact form to the backend (`POST /site/contact`, RULES P22),
 * where the message lands on the panel's Enquiries page.
 *
 * Posted from here rather than from the browser, so the API's address stays
 * off the page and no CORS rule is needed. The backend limits how often one
 * visitor may write, and since every request now comes from this server it
 * is told who the visitor is (`x-vokve-visitor-ip`) — believed only because
 * the shared secret (`CONTENT_REVALIDATE_SECRET`, the backend's
 * `SITE_REVALIDATE_SECRET`) comes with it.
 */

export type ContactFormValues = { name: string; email: string; phone: string; topic: string; message: string };

export type ContactFormState =
  | { status: 'idle' }
  | { status: 'sent' }
  | { status: 'invalid'; fields: Partial<Record<keyof ContactFormValues, string>> }
  | { status: 'limited' }
  | { status: 'error' };

/** Faster than a person can fill the form in: a script. Answered like a send, and dropped. */
const MIN_FILL_MS = 2_500;
const TIMEOUT_MS = 10_000;

const text = (form: FormData, name: string) => {
  const value = form.get(name);
  return typeof value === 'string' ? value.trim() : '';
};

async function visitorIp(): Promise<string | null> {
  const list = await headers();
  const forwarded = list.get('x-forwarded-for')?.split(',')[0]?.trim();
  return forwarded || list.get('x-real-ip')?.trim() || null;
}

export async function sendContactMessage(_previous: ContactFormState, form: FormData): Promise<ContactFormState> {
  const values: ContactFormValues = {
    name: text(form, 'name'),
    email: text(form, 'email'),
    phone: text(form, 'phone'),
    topic: text(form, 'topic'),
    message: text(form, 'message'),
  };

  const honeypot = text(form, 'website');
  const startedAt = Number(text(form, 'startedAt'));
  if (honeypot || (Number.isFinite(startedAt) && startedAt > 0 && Date.now() - startedAt < MIN_FILL_MS)) {
    return { status: 'sent' };
  }

  if (!backendBase) {
    console.error('contact form: neither VOKVE_CONTENT_API_URL nor VOKVE_API_URL is set — the message was not sent');
    return { status: 'error' };
  }

  const ip = await visitorIp();
  const secret = process.env.CONTENT_REVALIDATE_SECRET;
  let res: Response;
  try {
    res = await fetch(`${backendBase}/site/contact`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        accept: 'application/json',
        ...(secret && ip ? { 'x-vokve-site-key': secret, 'x-vokve-visitor-ip': ip } : {}),
      },
      body: JSON.stringify({
        name: values.name,
        email: values.email,
        phone: values.phone || null,
        topic: values.topic || null,
        message: values.message,
        page: '/contact',
      }),
      cache: 'no-store',
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
  } catch (error) {
    console.error('contact form: the backend could not be reached', error);
    return { status: 'error' };
  }

  if (res.ok) return { status: 'sent' };
  if (res.status === 429) return { status: 'limited' };
  if (res.status === 422) {
    const body = (await res.json().catch(() => null)) as { error?: { details?: Record<string, string> } } | null;
    const details = body?.error?.details ?? {};
    const fields: Partial<Record<keyof ContactFormValues, string>> = {};
    for (const key of ['name', 'email', 'phone', 'topic', 'message'] as const) {
      if (details[key]) fields[key] = details[key];
    }
    if (Object.keys(fields).length > 0) return { status: 'invalid', fields };
  }
  console.error(`contact form: the backend answered ${res.status}`);
  return { status: 'error' };
}
