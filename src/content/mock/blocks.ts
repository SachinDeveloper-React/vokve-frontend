/**
 * Shorthand for writing legal blocks in the mocks. The output is the plain
 * JSON the backend will send — these helpers exist only to keep the mock
 * policies readable.
 */
export const p = (text: string) => ({ type: 'paragraph' as const, text });
export const ul = (...items: string[]) => ({ type: 'list' as const, style: 'bullet' as const, items });
export const ol = (...items: string[]) => ({ type: 'list' as const, style: 'number' as const, items });
export const note = (tone: 'info' | 'warning' | 'success', title: string | null, text: string) => ({
  type: 'callout' as const,
  tone,
  title,
  text,
});
export const table = (columns: string[], rows: string[][]) => ({ type: 'table' as const, columns, rows });
export const defs = (items: [term: string, description: string][]) => ({
  type: 'definitions' as const,
  items: items.map(([term, description]) => ({ term, description })),
});
