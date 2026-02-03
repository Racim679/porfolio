'use client';

import { motion } from 'framer-motion';

const WIPE_COLOR = '#2563eb';

const TRANSITION_CONFIG = {
  duration: 0.6,
  easing: [0.65, 0, 0.35, 1] as const,
  enterDelay: 0.5,
};

type WipeMode = 'masking' | 'revealing';

interface WipeOverlayProps {
  mode: WipeMode;
  onMaskingComplete: () => void;
  onRevealingComplete: () => void;
}

export default function WipeOverlay({
  mode,
  onMaskingComplete,
  onRevealingComplete,
}: WipeOverlayProps) {
  const isMasking = mode === 'masking';

  return (
    <motion.div
      key="wipe-overlay"
      className="pointer-events-none"
      initial={{
        clipPath: isMasking ? 'inset(100% 0% 0% 0%)' : 'inset(0% 0% 0% 0%)',
      }}
      animate={{
        clipPath: isMasking ? 'inset(0% 0% 0% 0%)' : 'inset(0% 0% 100% 0%)',
      }}
      transition={{
        clipPath: {
          duration: TRANSITION_CONFIG.duration,
          ease: TRANSITION_CONFIG.easing,
          delay: isMasking ? 0 : TRANSITION_CONFIG.enterDelay,
        },
      }}
      onAnimationComplete={() => {
        if (isMasking) onMaskingComplete();
        else onRevealingComplete();
      }}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        width: '100%',
        height: '100%',
        backgroundColor: WIPE_COLOR,
        willChange: 'clip-path',
      }}
    />
  );
}
