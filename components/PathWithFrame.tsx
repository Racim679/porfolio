'use client';

import { motion, useMotionValue, useMotionValueEvent, animate, useInView } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';

// Vector 135.svg — path (forme)
const VECTOR_VIEWBOX = '0 0 91 106';
const VECTOR_PATH_D =
  'M41.375 4.67177C43.3456 4.49246 45.2771 4.32028 47.17 4.15511C98.9451 -0.362712 100.516 95.3177 48.875 101.172C-5.6357 107.351 -13.2592 9.64298 41.375 4.67177Z';

// Point bas (48.875, 101.172). Montée vers le milieu : facteur 0.5 = il monte deux fois moins qu’avant
const BOTTOM_Y_INITIAL = 101.172;
const BOTTOM_RISE_FACTOR = 1.2; // 1 = demi-distance, >1 = monte un peu plus
const BOTTOM_Y_FINAL =
  BOTTOM_Y_INITIAL - (BOTTOM_Y_INITIAL - 53) * 0.5 * BOTTOM_RISE_FACTOR; // 53 = milieu viewBox
const VECTOR_SQUEEZE_DELAY_S = 3.3;
const VECTOR_SQUEEZE_DURATION_S = 0.8;

// Points de contrôle autour du bas dans le path original
const RIGHT_CP_X_INITIAL = 100.516;
const RIGHT_CP_Y_INITIAL = 95.3177;
const LEFT_CP_X_INITIAL = -5.6357;
const LEFT_CP_Y_INITIAL = 107.351;

// Facteurs de suivi des poignées (à ajuster si besoin)
const RIGHT_CP_FOLLOW = 1;   // suit complètement le point bas
const LEFT_CP_FOLLOW = 0.8;  // suit légèrement moins (plus "lourd")

// Rapprochement horizontal des côtés vers le centre pendant le squeeze (en unités viewBox)
const X_PULL_TOWARD_CENTER = 0;
// Ease-out pour le X : la majeure partie du rapprochement se fait au début, moins en fin d’animation
const xEaseOut = (t: number) => t * (2 - t);

const BUMP_OFFSET = 6;

function buildVectorPathD(bottomY: number) {
  const dy = bottomY - BOTTOM_Y_INITIAL;
  const progress = (BOTTOM_Y_INITIAL - bottomY) / (BOTTOM_Y_INITIAL - BOTTOM_Y_FINAL);
  const t = Math.max(0, Math.min(1, progress));
  const tX = xEaseOut(t);

  let rightCpY = RIGHT_CP_Y_INITIAL + RIGHT_CP_FOLLOW * dy;
  let leftCpY = LEFT_CP_Y_INITIAL + LEFT_CP_FOLLOW * dy;
  const bump = BUMP_OFFSET * t;
  rightCpY += bump;
  leftCpY += bump;
  const rightCpX = RIGHT_CP_X_INITIAL - X_PULL_TOWARD_CENTER * tX;
  const leftCpX = LEFT_CP_X_INITIAL + X_PULL_TOWARD_CENTER * tX;
  const cpY = (rightCpY + leftCpY) / 2;
  rightCpY = cpY;
  leftCpY = cpY;

  return (
    `M41.375 4.67177` +
    `C43.3456 4.49246 45.2771 4.32028 47.17 4.15511` +
    `C98.9451 -0.362712 ${rightCpX} ${rightCpY} 48.875 ${bottomY}` +
    `C${leftCpX} ${leftCpY} -13.2592 9.64298 41.375 4.67177Z`
  );
}

// Frame 15.svg — frame (cercle)
const FRAME_SIZE = 72;

// Translation de l'ensemble vers la gauche quand le rect arrive à gauche (px)
const ENSEMBLE_SHIFT_LEFT = 12;

export default function PathWithFrame() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.3 });
  const bottomY = useMotionValue(BOTTOM_Y_INITIAL);
  const [pathD, setPathD] = useState(() => buildVectorPathD(BOTTOM_Y_INITIAL));

  useMotionValueEvent(bottomY, 'change', (y: number) => setPathD(buildVectorPathD(y)));

  useEffect(() => {
    if (!isInView) return;
    const ctrl = animate(bottomY, BOTTOM_Y_FINAL, {
      delay: VECTOR_SQUEEZE_DELAY_S,
      duration: VECTOR_SQUEEZE_DURATION_S,
      ease: [0.65, 0, 0.35, 1],
    });
    return () => ctrl.stop();
  }, [isInView, bottomY]);

  return (
    <section ref={sectionRef} className="relative w-full py-16 bg-white">
      <div className="relative w-full max-w-2xl mx-auto px-4 flex justify-center items-center" style={{ minHeight: 220 }}>
        <div className="relative flex justify-center items-center" style={{ minHeight: 220, minWidth: 120 }}>
        {/* Vector + Frame 15 : forme beige + cercle noir au centre */}
        <svg
          viewBox={VECTOR_VIEWBOX}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          width="120"
          height="140"
          className="block"
          aria-hidden
          style={{ filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.08))', minWidth: 120 }}
        >
          {/* Forme beige (Vector 135) */}
          <path
            d={pathD}
            fill="#F5E7C7"
            stroke="black"
            strokeWidth="8"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
          {/* Frame 15 : cercle noir (fichier frame-15.svg) centré dans la forme */}
          <image
            href="/frame-15.svg"
            x="18.2"
            y="25.7"
            width="54.6"
            height="54.6"
            preserveAspectRatio="xMidYMid meet"
          />
        </svg>
        </div>
      </div>
    </section>
  );
}
