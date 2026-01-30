'use client';

import { motion, useInView } from 'framer-motion';
import { useRef, useMemo, useState, useEffect } from 'react';

type SplitType = 'chars' | 'words';

interface SplitTextProps {
  text: string;
  splitType?: SplitType;
  /** Délai (ms) entre chaque lettre/mot */
  delay?: number;
  /** Durée (s) de l'animation de chaque élément */
  duration?: number;
  /** Propriétés initiales (ex: { opacity: 0, y: 40 }) */
  from?: { opacity?: number; y?: number };
  /** Propriétés finales (ex: { opacity: 1, y: 0 }) */
  to?: { opacity?: number; y?: number };
  threshold?: number;
  rootMargin?: string;
  /** Délai (ms) avant de lancer l'animation une fois en vue */
  startDelayMs?: number;
  className?: string;
  style?: React.CSSProperties;
  as?: 'div' | 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span';
}

const defaults = {
  splitType: 'chars' as SplitType,
  delay: 50,
  duration: 1.25,
  from: { opacity: 0, y: 40 },
  to: { opacity: 1, y: 0 },
  threshold: 0.1,
  rootMargin: '-50px',
  as: 'p' as const,
};

export default function SplitText({
  text,
  splitType = defaults.splitType,
  delay = defaults.delay,
  duration = defaults.duration,
  from = defaults.from,
  to = defaults.to,
  threshold = defaults.threshold,
  rootMargin = defaults.rootMargin,
  startDelayMs = 0,
  className,
  style,
  as: Component = defaults.as,
}: SplitTextProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: threshold, margin: rootMargin });
  const [canAnimate, setCanAnimate] = useState(false);

  useEffect(() => {
    if (!isInView || startDelayMs <= 0) {
      if (isInView && startDelayMs <= 0) setCanAnimate(true);
      return;
    }
    const t = setTimeout(() => setCanAnimate(true), startDelayMs);
    return () => clearTimeout(t);
  }, [isInView, startDelayMs]);

  const items = useMemo(() => {
    if (splitType === 'words') {
      return text.split(/\s+/).filter(Boolean);
    }
    return text.split('');
  }, [text, splitType]);

  const shouldAnimate = startDelayMs <= 0 ? isInView : canAnimate;

  return (
    <Component ref={ref as never} className={className} style={style}>
      {items.map((item, index) => (
        <span key={index} className="inline-block">
          <motion.span
            className="inline-block"
            initial={{ opacity: from.opacity ?? 0, y: from.y ?? 40 }}
            animate={
              shouldAnimate
                ? { opacity: to.opacity ?? 1, y: to.y ?? 0 }
                : undefined
            }
            transition={{
              duration,
              delay: index * (delay / 1000),
              ease: [0.25, 0.1, 0.25, 1],
            }}
          >
            {item}
          </motion.span>
          {splitType === 'words' && index < items.length - 1 ? '\u00A0' : null}
        </span>
      ))}
    </Component>
  );
}
