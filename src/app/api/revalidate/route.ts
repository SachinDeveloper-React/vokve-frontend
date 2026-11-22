import { timingSafeEqual } from 'node:crypto';
import { revalidateTag } from 'next/cache';
import { CONTENT_TAGS, type ContentTag } from '@/lib/content';

/**
 * The backend (or the CRM, after an edit) calls this to refresh pages now
 * instead of within the hour:
 *
 *   POST /api/revalidate
 *   Authorization: Bearer $CONTENT_REVALIDATE_SECRET
 *   { "tags": ["site:legal"] }          // or ["site"] for everything
 *
 * Without the secret configured the route does not exist (404), so a deploy
 * that forgot it cannot be poked by anyone.
 */
export async function POST(request: Request) {
  const secret = process.env.CONTENT_REVALIDATE_SECRET;
  if (!secret) return new Response(null, { status: 404 });

  const given = Buffer.from(request.headers.get('authorization') ?? '');
  const expected = Buffer.from(`Bearer ${secret}`);
  if (given.length !== expected.length || !timingSafeEqual(given, expected)) {
    return Response.json({ error: 'UNAUTHORIZED' }, { status: 401 });
  }

  let body: unknown = {};
  try {
    body = await request.json();
  } catch {
    // An empty body refreshes everything.
  }
  const requested = (body as { tags?: unknown }).tags;
  const tags: string[] = Array.isArray(requested) && requested.length > 0 ? requested.map(String) : ['site'];

  const known = new Set<string>(CONTENT_TAGS);
  const valid = tags.filter((tag): tag is ContentTag | `site:legal:${string}` => known.has(tag) || /^site:legal:[a-z0-9-]+$/.test(tag));
  const unknown = tags.filter(tag => !valid.includes(tag as ContentTag));
  if (unknown.length > 0) return Response.json({ error: 'UNKNOWN_TAGS', unknown, known: [...known] }, { status: 422 });

  for (const tag of valid) revalidateTag(tag, 'max');
  return Response.json({ revalidated: valid });
}
