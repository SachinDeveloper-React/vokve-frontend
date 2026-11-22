import 'server-only';
import { z } from 'zod';

/**
 * Where content comes from.
 *
 * `VOKVE_CONTENT_API_URL` set (e.g. `https://api.vokve.app/v1`) → every page
 * reads `GET {url}/site/...`. Unset → the mock content in `src/content/mock`.
 * There is deliberately no silent fallback from the API to the mocks: a
 * backend that is down at build time fails the build rather than shipping
 * placeholder policies, and at runtime Next keeps serving the last good copy.
 */
const API_URL = process.env.VOKVE_CONTENT_API_URL?.trim().replace(/\/+$/, '') || null;

export const contentSource: 'api' | 'mock' = API_URL ? 'api' : 'mock';

const TIMEOUT_MS = 10_000;

export class ContentError extends Error {
  override name = 'ContentError';
}

type Options = { optional?: boolean };

/**
 * Loads one piece of content and holds it to its schema. Mocks go through
 * the same parse as the API, so a mock that drifts from the contract fails
 * exactly like a bad API response would.
 */
export async function loadContent<S extends z.ZodType>(
  path: string,
  schema: S,
  mock: () => unknown,
  options: { optional: true },
): Promise<z.output<S> | null>;
export async function loadContent<S extends z.ZodType>(
  path: string,
  schema: S,
  mock: () => unknown,
  options?: Options,
): Promise<z.output<S>>;
export async function loadContent<S extends z.ZodType>(
  path: string,
  schema: S,
  mock: () => unknown,
  options: Options = {},
): Promise<z.output<S> | null> {
  const raw = API_URL ? await fetchFromApi(path) : mock();

  if (raw === undefined || raw === null) {
    if (options.optional) return null;
    throw new ContentError(`No content at ${path} (${contentSource}).`);
  }

  const parsed = schema.safeParse(raw);
  if (!parsed.success) {
    throw new ContentError(
      `Content at ${path} (${contentSource}) does not match the contract:\n${z.prettifyError(parsed.error)}`,
    );
  }
  return parsed.data;
}

async function fetchFromApi(path: string): Promise<unknown> {
  const url = `${API_URL}/site${path}`;
  let res: Response;
  try {
    res = await fetch(url, {
      headers: { accept: 'application/json' },
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
  } catch (err) {
    throw new ContentError(`Could not reach ${url}: ${(err as Error).message}`);
  }
  if (res.status === 404) return null;
  if (!res.ok) throw new ContentError(`${url} answered ${res.status}.`);
  return res.json();
}
