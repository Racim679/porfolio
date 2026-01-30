'use client';

import { ReactLenis } from 'lenis/react';
import type { LenisOptions } from 'lenis';

const lenisOptions: LenisOptions = {
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smoothWheel: true,
  lerp: 0.1,
  syncTouch: false,
  anchors: true,
  autoRaf: true,
  // Ralentir le scroll dans la section "Mes projets"
  virtualScroll: (data) => {
    if (typeof document === 'undefined') return true;
    const el = document.getElementById('projects');
    if (!el) return true;
    const rect = el.getBoundingClientRect();
    const inSection = rect.top < window.innerHeight && rect.bottom > 0;
    if (inSection) {
      data.deltaY *= 0.55;
      data.deltaX *= 0.55;
    }
    return true;
  },
};

export default function LenisProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ReactLenis root options={lenisOptions}>
      {children}
    </ReactLenis>
  );
}
