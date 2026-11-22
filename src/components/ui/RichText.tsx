import type { ReactNode } from 'react';
import { SmartLink } from './SmartLink';

/** `**bold**` or `[label](href)` — the only marks content may carry. */
const MARKS = /\*\*(.+?)\*\*|\[([^\]]+)\]\(([^)\s]+)\)/g;

/**
 * Renders backend text with its two inline marks as React elements. There is
 * no HTML path at all, so nothing typed into the panel can become markup.
 */
export function RichText({ text }: { text: string }) {
  const out: ReactNode[] = [];
  let last = 0;
  for (const match of text.matchAll(MARKS)) {
    const at = match.index ?? 0;
    if (at > last) out.push(text.slice(last, at));
    if (match[1] !== undefined) {
      out.push(<strong key={at}>{match[1]}</strong>);
    } else {
      out.push(
        <SmartLink key={at} href={match[3]}>
          {match[2]}
        </SmartLink>,
      );
    }
    last = at + match[0].length;
  }
  if (last < text.length) out.push(text.slice(last));
  return <>{out}</>;
}
