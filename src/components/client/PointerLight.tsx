'use client';

import { useEffect } from 'react';

/**
 * One listener for the whole page that gives glass surfaces their depth:
 * `[data-specular]` gets a light that follows the pointer (--mx/--my) and
 * `[data-tilt]` leans toward it (--tilt-x/--tilt-y). CSS does the drawing,
 * so nothing re-renders. Touch screens and reduced-motion visitors get flat,
 * still surfaces.
 */
export function PointerLight() {
  useEffect(() => {
    const finePointer = window.matchMedia('(pointer: fine)');
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (!finePointer.matches) return;

    let tilted: HTMLElement | null = null;
    const settle = (el: HTMLElement) => {
      el.style.removeProperty('--tilt-x');
      el.style.removeProperty('--tilt-y');
    };

    const onMove = (event: PointerEvent) => {
      const target = event.target instanceof Element ? event.target : null;

      const lit = target?.closest<HTMLElement>('[data-specular]');
      if (lit) {
        const box = lit.getBoundingClientRect();
        lit.style.setProperty('--mx', `${(event.clientX - box.left).toFixed(0)}px`);
        lit.style.setProperty('--my', `${(event.clientY - box.top).toFixed(0)}px`);
      }

      const tilt = reduceMotion.matches ? null : (target?.closest<HTMLElement>('[data-tilt]') ?? null);
      if (tilted && tilted !== tilt) settle(tilted);
      tilted = tilt;
      if (tilt) {
        const box = tilt.getBoundingClientRect();
        const x = (event.clientX - box.left) / box.width - 0.5;
        const y = (event.clientY - box.top) / box.height - 0.5;
        tilt.style.setProperty('--tilt-x', `${(-y * 7).toFixed(2)}deg`);
        tilt.style.setProperty('--tilt-y', `${(x * 9).toFixed(2)}deg`);
      }
    };

    const onLeave = () => {
      if (tilted) settle(tilted);
      tilted = null;
    };

    document.addEventListener('pointermove', onMove, { passive: true });
    document.documentElement.addEventListener('pointerleave', onLeave);
    return () => {
      document.removeEventListener('pointermove', onMove);
      document.documentElement.removeEventListener('pointerleave', onLeave);
    };
  }, []);

  return null;
}
