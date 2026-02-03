'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { usePathname, useRouter } from 'next/navigation';
import { useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { useTransition } from './TransitionContext';

const WIPE_COLOR = '#2563eb';

const TRANSITION_CONFIG = {
  exitDuration: 0.6,
  enterDuration: 0.6,
  enterDelay: 0.5,
  exitOffset: '-30%',
  enterOffset: '30%',
  easing: [0.65, 0, 0.35, 1] as const,
};

const exitTransition = {
  y: { duration: TRANSITION_CONFIG.exitDuration, ease: TRANSITION_CONFIG.easing },
  clipPath: { duration: TRANSITION_CONFIG.exitDuration, ease: TRANSITION_CONFIG.easing },
};

const enterTransition = {
  y: { duration: TRANSITION_CONFIG.enterDuration, delay: TRANSITION_CONFIG.enterDelay, ease: TRANSITION_CONFIG.easing },
  clipPath: { duration: TRANSITION_CONFIG.enterDuration, delay: TRANSITION_CONFIG.enterDelay, ease: TRANSITION_CONFIG.easing },
  visibility: { delay: TRANSITION_CONFIG.enterDelay, duration: 0 },
};

interface PageTransitionProps {
  children: ReactNode;
}

export default function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname();
  const router = useRouter();
  const ctx = useTransition();
  const pendingRoute = ctx?.pendingRoute ?? null;
  const clearPendingRoute = ctx?.clearPendingRoute ?? (() => {});
  const [displayedPathname, setDisplayedPathname] = useState(pathname);
  const childrenByPath = useRef<Record<string, ReactNode>>({});

  childrenByPath.current[pathname] = children;

  const isEnterPhase = pathname !== displayedPathname && !pendingRoute;
  const isExitPhase = Boolean(pendingRoute);

  const handleExitPhaseComplete = () => {
    if (pendingRoute) {
      router.push(pendingRoute);
      clearPendingRoute();
    }
  };

  const handleEnterComplete = () => {
    setDisplayedPathname(pathname);
  };

  // ——— Phase 1 (au clic) : masque sur la page actuelle (accueil), puis navigation
  if (isExitPhase) {
    return (
      <div
        className="relative min-h-screen w-full"
        style={{ backgroundColor: WIPE_COLOR }}
      >
        <motion.div
          key={`exit-phase-${pathname}`}
          initial={false}
          animate={{
            y: TRANSITION_CONFIG.exitOffset,
            clipPath: 'inset(0% 0% 100% 0%)',
            transition: exitTransition,
          }}
          onAnimationComplete={handleExitPhaseComplete}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            width: '100%',
            minHeight: '100vh',
            willChange: 'transform, clip-path',
          }}
        >
          {childrenByPath.current[pathname]}
        </motion.div>
      </div>
    );
  }

  // ——— Phase 2 (sur la page d’arrivée) : démasquage de la nouvelle page uniquement
  const enteringLayer = (
    <motion.div
      key={pathname}
      initial={{
        y: TRANSITION_CONFIG.enterOffset,
        clipPath: 'inset(100% 0% 0% 0%)',
        visibility: 'hidden',
      }}
      animate={{
        y: '0%',
        clipPath: 'inset(0% 0% 0% 0%)',
        visibility: 'visible',
        transition: enterTransition,
      }}
      onAnimationComplete={handleEnterComplete}
      style={{
        position: 'relative',
        width: '100%',
        minHeight: '100vh',
        willChange: 'transform, clip-path',
      }}
    >
      {children}
    </motion.div>
  );

  const currentPageOnly = (
    <motion.div
      key={pathname}
      style={{ position: 'relative', width: '100%', minHeight: '100vh' }}
    >
      {children}
    </motion.div>
  );

  return (
    <div
      className="relative min-h-screen w-full"
      style={{ backgroundColor: WIPE_COLOR }}
    >
      <AnimatePresence mode="sync" initial={false}>
        {isEnterPhase ? enteringLayer : currentPageOnly}
      </AnimatePresence>
    </div>
  );
}
