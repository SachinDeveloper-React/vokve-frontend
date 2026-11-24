import 'server-only';
import { z } from 'zod';

/**
 * Where content comes from.
 *
 * `VOKVE_CONTENT_API_URL` set (e.g. `https://api.vokve.com/v1`) → every page
 * reads `GET {url}/site/...`. Unset → the mock content in `src/content/mock`.
 * There is deliberately no silent fallback from the API to the mocks: a
 * backend that is down at build time fails the build rather than shipping
 * placeholder policies, and at runtime Next keeps serving the last good copy.
 */
const API_URL = process.env.VOKVE_CONTENT_API_URL?.trim().replace(/\/+$/, '') || null;

/**
 * The backend's `/v1` base for what it serves *today* (RULES P21): the
 * company's contact details, `GET /site/company`, which the CRM edits. Set
 * this alone and the copy stays on the mocks while the email, the numbers,
 * the address and the store links are the live ones. With
 * `VOKVE_CONTENT_API_URL` set, that base is used for these too.
 */
const LIVE_API_URL = API_URL ?? (process.env.VOKVE_API_URL?.trim().replace(/\/+$/, '') || null);

export const contentSource: 'api' | 'mock' = API_URL ? 'api' : 'mock';

const TIMEOUT_MS = 10_000;

export class ContentError extends Error {
  override name = 'ContentError';
}

type Options = {
  optional?: boolean;
  /** Served by the backend today: read from `VOKVE_API_URL` even while the copy is on the mocks. */
  live?: boolean;
  /**
   * Applied to the raw content before it is held to its schema — how the
   * live contact details are overlaid and their `{{tokens}}` filled, so the
   * result is checked exactly as a backend answer would be.
   */
  prepare?: (raw: unknown) => unknown;
};

/**
 * Loads one piece of content and holds it to its schema. Mocks go through
 * the same parse as the API, so a mock that drifts from the contract fails
 * exactly like a bad API response would.
 */
export async function loadContent<S extends z.ZodType>(
  path: string,
  schema: S,
  mock: () => unknown,
  options: Options & { optional: true },
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
  const base = options.live ? LIVE_API_URL : API_URL;
  const source = base ? 'api' : 'mock';
  const raw = base ? await fetchFromApi(base, path) : mock();

  if (raw === undefined || raw === null) {
    if (options.optional) return null;
    throw new ContentError(`No content at ${path} (${source}).`);
  }

  const parsed = schema.safeParse(options.prepare ? options.prepare(raw) : raw);
  if (!parsed.success) {
    throw new ContentError(
      `Content at ${path} (${source}) does not match the contract:\n${z.prettifyError(parsed.error)}`,
    );
  }
  return parsed.data;
}

async function fetchFromApi(base: string, path: string): Promise<unknown> {
  const url = `${base}/site${path}`;
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
