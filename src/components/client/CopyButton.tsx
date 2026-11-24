'use client';

import { Check, Copy } from 'lucide-react';
import { useEffect, useState } from 'react';

export function CopyButton({ value, label, copiedLabel }: { value: string; label: string; copiedLabel: string }) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(timer);
  }, [copied]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
    } catch {
      // Clipboard refused (insecure context, permissions): the code is on screen to type.
    }
  };

  return (
    <button type="button" onClick={copy} className="btn btn-secondary btn-sm" aria-live="polite">
      {copied ? <Check className="size-4 text-positive" aria-hidden="true" /> : <Copy className="size-4" aria-hidden="true" />}
      {copied ? copiedLabel : label}
    </button>
  );
}
