'use client';

import { motion, useInView } from 'framer-motion';
import { useRef, useMemo, useState, useEffect } from 'react';

type AnimateBy = 'words' | 'letters';
type Direction = 'top' | 'bottom';

interface BlurTextProps {
  text: string;
  animateBy?: AnimateBy;
  direction?: Direction;
  delay?: number;
  stepDuration?: number;
  threshold?: number;
  rootMargin?: string;
  /** Délai (ms) avant de lancer l'animation une fois l'élément en vue */
  startDelayMs?: number;
  className?: string;
  style?: React.CSSProperties;
  as?: 'div' | 'h1' | 'h2' | 'h3' | 'span';
}

const defaultProps = {
  animateBy: 'words' as AnimateBy,
  direction: 'top' as Direction,
  delay: 200,
  stepDuration: 0.35,
  threshold: 0.1,
  rootMargin: '0px',
  as: 'div' as const,
};

export default function BlurText({
  text,
  animateBy = defaultProps.animateBy,
  direction = defaultProps.direction,
  delay = defaultProps.delay,
  stepDuration = defaultProps.stepDuration,
  threshold = defaultProps.threshold,
  rootMargin = defaultProps.rootMargin,
  startDelayMs = 0,
  className,
  style,
  as: Component = defaultProps.as,
}: BlurTextProps) {
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
    if (animateBy === 'words') {
      return text.split(/\s+/).filter(Boolean);
    }
    return text.split('');
  }, [text, animateBy]);

  const yOffset = direction === 'top' ? -12 : 12;

  return (
    <Component ref={ref as never} className={className} style={style}>
      {items.map((item, index) => (
        <span key={index} className="inline-block">
          <motion.span
            className="inline-block"
            initial={{
              filter: 'blur(10px)',
              opacity: 0,
              y: yOffset,
            }}
            animate={
              (startDelayMs <= 0 ? isInView : canAnimate)
                ? {
                    filter: 'blur(0px)',
                    opacity: 1,
                    y: 0,
                  }
                : undefined
            }
            transition={{
              duration: stepDuration,
              delay: index * (delay / 1000),
              ease: [0.25, 0.1, 0.25, 1],
            }}
          >
            {item}
          </motion.span>
          {animateBy === 'words' && index < items.length - 1 ? '\u00A0' : null}
        </span>
      ))}
    </Component>
  );
}
