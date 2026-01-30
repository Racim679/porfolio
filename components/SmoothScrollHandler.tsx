'use client';

import { useEffect } from 'react';
import { smoothScrollTo } from '@/lib/smoothScroll';

/**
 * Intercepte les clics sur les ancres (#section) pour utiliser le smooth scroll
 * avec accentuation fluide près de #projects.
 */
export default function SmoothScrollHandler() {
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest('a[href^="#"]');
      if (!target) return;
      const href = (target as HTMLAnchorElement).getAttribute('href');
      if (!href || href === '#') return;
      const id = href.slice(1);
      if (!id) return;
      const anchor = target as HTMLAnchorElement;
      if (anchor.target === '_blank' || anchor.hasAttribute('download')) return;
      const el = document.getElementById(id);
      if (!el) return;
      e.preventDefault();
      smoothScrollTo(el, { block: 'start' });
    };

    document.addEventListener('click', handleClick, { capture: true });
    return () => document.removeEventListener('click', handleClick, { capture: true });
  }, []);

  return null;
}
