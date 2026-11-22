'use client';

import { useEffect, useRef, type ReactNode } from 'react';

/**
 * A 3D stage whose contents turn gently toward the pointer anywhere on the
 * page. Writes `--rx`/`--ry` on its own element each frame while moving
 * (eased, so it glides rather than snaps); `.stage-inner` reads them.
 */
export function SpatialStage({
  children,
  className,
  strength = 8,
}: {
  children: ReactNode;
  className?: string;
  strength?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const finePointer = window.matchMedia('(pointer: fine)');
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (!finePointer.matches || reduceMotion.matches) return;

    let frame = 0;
    let targetX = 0;
    let targetY = 0;
    let x = 0;
    let y = 0;

    const step = () => {
      x += (targetX - x) * 0.07;
      y += (targetY - y) * 0.07;
      el.style.setProperty('--rx', `${(-y * strength).toFixed(2)}deg`);
      el.style.setProperty('--ry', `${(x * strength).toFixed(2)}deg`);
      frame = Math.abs(targetX - x) + Math.abs(targetY - y) > 0.001 ? requestAnimationFrame(step) : 0;
    };

    const onMove = (event: PointerEvent) => {
      targetX = Math.max(-1, Math.min(1, (event.clientX / window.innerWidth) * 2 - 1));
      targetY = Math.max(-1, Math.min(1, (event.clientY / window.innerHeight) * 2 - 1));
      if (!frame) frame = requestAnimationFrame(step);
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    return () => {
      window.removeEventListener('pointermove', onMove);
      cancelAnimationFrame(frame);
    };
  }, [strength]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
