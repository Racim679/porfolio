'use client';

import { motion } from 'framer-motion';

const WIPE_COLOR = '#2563eb';

const TRANSITION_CONFIG = {
  duration: 0.6,
  easing: [0.65, 0, 0.35, 1] as const,
  enterDelay: 0.5,
};

type WipeMode = 'masking' | 'waiting' | 'revealing';

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
  const isRevealing = mode === 'revealing';

  const fullCover = 'inset(0% 0% 0% 0%)';
  const initialClipPath = isMasking ? 'inset(100% 0% 0% 0%)' : fullCover;
  const animateClipPath = isRevealing ? 'inset(0% 0% 100% 0%)' : fullCover;

  return (
    <motion.div
      key="wipe-overlay"
      className="pointer-events-none"
      initial={{ clipPath: initialClipPath }}
      animate={{ clipPath: animateClipPath }}
      transition={{
        clipPath: {
          duration: TRANSITION_CONFIG.duration,
          ease: TRANSITION_CONFIG.easing,
          delay: isMasking ? 0 : isRevealing ? TRANSITION_CONFIG.enterDelay : 0,
        },
      }}
      onAnimationComplete={() => {
        if (isMasking) onMaskingComplete();
        else if (isRevealing) onRevealingComplete();
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
