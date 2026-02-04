'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useLayoutEffect, useEffect } from 'react';
import type { ReactNode } from 'react';
import { useTransition } from './TransitionContext';
import WipeOverlay from './WipeOverlay';

const CONTENT_Y_OFFSET = '12%';

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
  const [navigatingTo, setNavigatingTo] = useState<string | null>(null);

  const showOverlay = Boolean(pendingRoute) || Boolean(navigatingTo) || revealing;

  useLayoutEffect(() => {
    if (showOverlay) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [showOverlay]);

  useEffect(() => {
    if (navigatingTo && pathname === navigatingTo) {
      setRevealing(true);
      setNavigatingTo(null);
    }
  }, [navigatingTo, pathname]);

  const handleMaskingComplete = () => {
    if (pendingRoute) {
      router.push(pendingRoute);
      setNavigatingTo(pendingRoute);
      clearPendingRoute();
    }
  };

  const handleRevealingComplete = () => {
    setRevealing(false);
  };

  const overlayMode = pendingRoute ? 'masking' : revealing ? 'revealing' : 'waiting';

  const contentY =
    pendingRoute ? `-${CONTENT_Y_OFFSET}` : revealing ? '0%' : showOverlay ? `-${CONTENT_Y_OFFSET}` : '0%';
  const contentTransition =
    pendingRoute
      ? { y: { duration: 0.6, ease: [0.65, 0, 0.35, 1] as const } }
      : revealing
        ? { y: { duration: 0.6, delay: 0.5, ease: [0.65, 0, 0.35, 1] as const } }
        : undefined;

  return (
    <div className="relative min-h-screen w-full">
      <motion.div
        animate={{ y: contentY }}
        transition={contentTransition}
        style={{ width: '100%', minHeight: '100vh' }}
      >
        {children}
      </motion.div>

      <AnimatePresence>
        {showOverlay && (
          <WipeOverlay
            key="wipe"
            mode={overlayMode}
            onMaskingComplete={handleMaskingComplete}
            onRevealingComplete={handleRevealingComplete}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
