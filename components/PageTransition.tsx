'use client';

import { AnimatePresence } from 'framer-motion';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useLayoutEffect } from 'react';
import type { ReactNode } from 'react';
import { useTransition } from './TransitionContext';
import WipeOverlay from './WipeOverlay';

interface PageTransitionProps {
  children: ReactNode;
}

export default function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname();
  const router = useRouter();
  const ctx = useTransition();
  const pendingRoute = ctx?.pendingRoute ?? null;
  const clearPendingRoute = ctx?.clearPendingRoute ?? (() => {});
  const [revealing, setRevealing] = useState(false);

  const showOverlay = Boolean(pendingRoute) || revealing;

  useLayoutEffect(() => {
    if (showOverlay) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [showOverlay]);

  const handleMaskingComplete = () => {
    if (pendingRoute) {
      router.push(pendingRoute);
      clearPendingRoute();
      setRevealing(true);
    }
  };

  const handleRevealingComplete = () => {
    setRevealing(false);
  };

  return (
    <div className="relative min-h-screen w-full">
      {/* Contenu de la page toujours monté, jamais remplacé */}
      {children}

      <AnimatePresence>
        {showOverlay && (
          <WipeOverlay
            key="wipe"
            mode={pendingRoute ? 'masking' : 'revealing'}
            onMaskingComplete={handleMaskingComplete}
            onRevealingComplete={handleRevealingComplete}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
