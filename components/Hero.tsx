'use client';

import Image from 'next/image';
import AuditButton from './AuditButton';
import { motion, useMotionValue, useTransform, MotionValue } from 'framer-motion';
import { useEffect, useState, useRef } from 'react';

interface HeroProps {
  profileImage?: string;
  description?: string;
}

// Trajectoire rééchantillonnée, tronquée à la sortie droite, points à tangente parasite supprimés — 234 points
const planePath = [
  { x: 0.09, y: 48.24 },
  { x: 0.87, y: 48.33 },
  { x: 1.65, y: 48.41 },
  { x: 2.43, y: 48.5 },
  { x: 3.21, y: 48.59 },
  { x: 3.99, y: 48.68 },
  { x: 4.77, y: 48.77 },
  { x: 5.55, y: 48.86 },
  { x: 6.33, y: 48.95 },
  { x: 7.11, y: 49.05 },
  { x: 7.88, y: 49.15 },
  { x: 8.66, y: 49.24 },
  { x: 9.44, y: 49.34 },
  { x: 10.22, y: 49.44 },
  { x: 11.0, y: 49.55 },
  { x: 11.77, y: 49.66 },
  { x: 12.55, y: 49.78 },
  { x: 13.32, y: 49.9 },
  { x: 14.1, y: 50.04 },
  { x: 14.87, y: 50.18 },
  { x: 15.64, y: 50.33 },
  { x: 16.4, y: 50.51 },
  { x: 17.17, y: 50.69 },
  { x: 17.92, y: 50.92 },
  { x: 18.66, y: 51.16 },
  { x: 19.4, y: 51.44 },
  { x: 20.12, y: 51.76 },
  { x: 20.83, y: 52.09 },
  { x: 21.52, y: 52.46 },
  { x: 22.21, y: 52.83 },
  { x: 22.88, y: 53.24 },
  { x: 23.55, y: 53.65 },
  { x: 24.21, y: 54.08 },
  { x: 24.86, y: 54.51 },
  { x: 25.51, y: 54.95 },
  { x: 26.15, y: 55.41 },
  { x: 26.78, y: 55.87 },
  { x: 27.41, y: 56.34 },
  { x: 28.03, y: 56.82 },
  { x: 28.66, y: 57.29 },
  { x: 29.26, y: 57.8 },
  { x: 29.86, y: 58.3 },
  { x: 30.46, y: 58.81 },
  { x: 31.03, y: 59.34 },
  { x: 31.61, y: 59.87 },
  { x: 32.16, y: 60.44 },
  { x: 32.7, y: 61.0 },
  { x: 33.22, y: 61.59 },
  { x: 33.72, y: 62.19 },
  { x: 34.21, y: 62.81 },
  { x: 34.67, y: 63.44 },
  { x: 35.12, y: 64.09 },
  { x: 35.55, y: 64.75 },
  { x: 35.94, y: 65.43 },
  { x: 36.31, y: 66.12 },
  { x: 36.66, y: 66.82 },
  { x: 36.97, y: 67.54 },
  { x: 37.25, y: 68.27 },
  { x: 37.49, y: 69.02 },
  { x: 37.7, y: 69.77 },
  { x: 37.86, y: 70.54 },
  { x: 38.0, y: 71.32 },
  { x: 38.11, y: 72.09 },
  { x: 38.19, y: 72.87 },
  { x: 38.25, y: 73.65 },
  { x: 38.29, y: 74.44 },
  { x: 38.29, y: 75.22 },
  { x: 38.28, y: 76.01 },
  { x: 38.24, y: 76.79 },
  { x: 38.19, y: 77.57 },
  { x: 38.08, y: 78.35 },
  { x: 37.97, y: 79.13 },
  { x: 37.78, y: 79.89 },
  { x: 37.32, y: 81.02 },
  { x: 36.72, y: 82.04 },
  { x: 36.02, y: 83.01 },
  { x: 35.33, y: 83.61 },
  { x: 34.55, y: 84.12 },
  { x: 33.49, y: 84.54 },
  { x: 32.1, y: 84.82 },
  { x: 30.5, y: 84.91 },
  { x: 29.03, y: 84.69 },
  { x: 27.79, y: 84.21 },
  { x: 26.71, y: 83.49 },
  { x: 26.06, y: 82.69 },
  { x: 25.64, y: 82.02 },
  { x: 25.33, y: 81.3 },
  { x: 25.09, y: 80.56 },
  { x: 24.94, y: 79.79 },
  { x: 24.85, y: 79.01 },
  { x: 24.83, y: 78.22 },
  { x: 24.87, y: 77.44 },
  { x: 24.96, y: 76.66 },
  { x: 25.1, y: 75.89 },
  { x: 25.3, y: 75.13 },
  { x: 25.59, y: 74.41 },
  { x: 25.99, y: 73.73 },
  { x: 26.47, y: 73.11 },
  { x: 27.01, y: 72.54 },
  { x: 27.58, y: 72.0 },
  { x: 28.17, y: 71.48 },
  { x: 28.76, y: 70.97 },
  { x: 29.37, y: 70.48 },
  { x: 29.98, y: 69.98 },
  { x: 30.59, y: 69.49 },
  { x: 31.21, y: 69.01 },
  { x: 31.83, y: 68.53 },
  { x: 32.45, y: 68.05 },
  { x: 33.07, y: 67.56 },
  { x: 33.68, y: 67.07 },
  { x: 34.29, y: 66.58 },
  { x: 34.91, y: 66.1 },
  { x: 35.53, y: 65.62 },
  { x: 36.16, y: 65.14 },
  { x: 36.79, y: 64.68 },
  { x: 37.44, y: 64.24 },
  { x: 38.1, y: 63.81 },
  { x: 38.78, y: 63.42 },
  { x: 39.47, y: 63.06 },
  { x: 40.18, y: 62.72 },
  { x: 40.9, y: 62.41 },
  { x: 41.63, y: 62.13 },
  { x: 42.37, y: 61.86 },
  { x: 43.12, y: 61.63 },
  { x: 43.88, y: 61.42 },
  { x: 44.64, y: 61.23 },
  { x: 45.41, y: 61.06 },
  { x: 46.18, y: 60.93 },
  { x: 46.95, y: 60.8 },
  { x: 47.73, y: 60.68 },
  { x: 48.5, y: 60.54 },
  { x: 49.28, y: 60.41 },
  { x: 50.05, y: 60.28 },
  { x: 50.82, y: 60.15 },
  { x: 51.6, y: 60.04 },
  { x: 52.38, y: 59.95 },
  { x: 53.16, y: 59.88 },
  { x: 53.94, y: 59.85 },
  { x: 54.73, y: 59.85 },
  { x: 55.51, y: 59.9 },
  { x: 56.29, y: 59.98 },
  { x: 57.07, y: 60.09 },
  { x: 57.84, y: 60.21 },
  { x: 58.62, y: 60.35 },
  { x: 59.38, y: 60.52 },
  { x: 60.15, y: 60.69 },
  { x: 60.92, y: 60.86 },
  { x: 61.68, y: 61.05 },
  { x: 62.44, y: 61.25 },
  { x: 63.19, y: 61.47 },
  { x: 63.94, y: 61.71 },
  { x: 64.69, y: 61.95 },
  { x: 65.44, y: 62.16 },
  { x: 66.2, y: 62.34 },
  { x: 66.98, y: 62.47 },
  { x: 67.76, y: 62.54 },
  { x: 68.54, y: 62.57 },
  { x: 69.33, y: 62.54 },
  { x: 70.11, y: 62.49 },
  { x: 70.89, y: 62.4 },
  { x: 71.66, y: 62.27 },
  { x: 72.42, y: 62.08 },
  { x: 73.16, y: 61.81 },
  { x: 73.86, y: 61.33 },
  { x: 74.44, y: 60.85 },
  { x: 74.95, y: 60.33 },
  { x: 75.45, y: 59.72 },
  { x: 75.97, y: 59.14 },
  { x: 76.51, y: 58.57 },
  { x: 77.06, y: 58.0 },
  { x: 77.61, y: 57.44 },
  { x: 78.16, y: 56.88 },
  { x: 78.7, y: 56.32 },
  { x: 79.24, y: 55.75 },
  { x: 79.77, y: 55.17 },
  { x: 80.3, y: 54.59 },
  { x: 80.82, y: 54.0 },
  { x: 81.33, y: 53.41 },
  { x: 81.85, y: 52.81 },
  { x: 82.38, y: 52.24 },
  { x: 82.93, y: 51.68 },
  { x: 83.5, y: 51.38 },
  { x: 84.11, y: 51.1 },
  { x: 84.55, y: 50.92 },
  { x: 85.06, y: 50.8 },
  { x: 85.84, y: 50.7 },
  { x: 86.62, y: 50.66 },
  { x: 87.27, y: 50.8 },
  { x: 87.83, y: 51.05 },
  { x: 88.32, y: 51.41 },
  { x: 88.73, y: 51.8 },
  { x: 89.1, y: 52.29 },
  { x: 89.48, y: 52.98 },
  { x: 89.83, y: 53.68 },
  { x: 90.19, y: 54.37 },
  { x: 90.58, y: 55.06 },
  { x: 91.02, y: 55.71 },
  { x: 91.5, y: 56.33 },
  { x: 92.03, y: 56.9 },
  { x: 92.61, y: 57.44 },
  { x: 93.21, y: 57.94 },
  { x: 93.83, y: 58.41 },
  { x: 94.48, y: 58.86 },
  { x: 95.14, y: 59.28 },
  { x: 95.81, y: 59.69 },
  { x: 96.51, y: 60.05 },
  { x: 97.21, y: 60.39 },
  { x: 97.94, y: 60.69 },
  { x: 98.68, y: 60.95 },
  { x: 99.44, y: 61.16 },
  { x: 100.2, y: 61.32 },
  { x: 100.72, y: 61.32 },
  { x: 101.24, y: 61.22 },
  { x: 101.65, y: 61.17 },
  { x: 102.07, y: 61.21 },
  { x: 102.8, y: 61.18 },
  { x: 103.59, y: 61.18 },
  { x: 104.37, y: 61.2 },
  { x: 105.16, y: 61.21 },
  { x: 105.94, y: 61.23 },
  { x: 106.73, y: 61.24 },
  { x: 107.51, y: 61.26 },
  { x: 108.3, y: 61.29 },
  { x: 109.08, y: 61.31 },
  { x: 109.87, y: 61.33 },
  { x: 110.65, y: 61.35 },
  { x: 111.43, y: 61.37 },
  { x: 112.22, y: 61.38 },
  { x: 113.0, y: 61.38 },
  { x: 113.79, y: 61.39 },
  { x: 114.57, y: 61.39 },
  { x: 115.36, y: 61.4 },
  { x: 116.14, y: 61.35 },
  { x: 116.92, y: 61.28 },
];


// Angles de rotation (degrés) selon la tangente à chaque point — avion orienté dans la direction du mouvement
function getPlaneRotations(path: { x: number; y: number }[]): number[] {
  const rotations: number[] = [];
  for (let i = 0; i < path.length; i++) {
    const prev = path[Math.max(0, i - 1)];
    const next = path[Math.min(path.length - 1, i + 1)];
    const dx = next.x - prev.x;
    const dy = next.y - prev.y;
    // Angle en degrés : atan2(dy, dx) car y croît vers le bas ; CSS rotate sens horaire = positif
    // Theta 0 : à l'état initial l'avion est déjà rotationné de 40° dans le sens horaire
    const angleRad = Math.atan2(dy, dx);
    const angleDeg = (angleRad * 180) / Math.PI + 40;
    rotations.push(angleDeg);
  }
  return rotations;
}

// "Déroule" les angles pour éviter les sauts brusques dus au passage par ±180° (wrap 360°)
function unwrapAngles(angles: number[]): number[] {
  if (angles.length === 0) return angles;
  const unwrapped: number[] = [angles[0]];
  for (let i = 1; i < angles.length; i++) {
    let current = angles[i];
    let prev = unwrapped[i - 1];
    let delta = current - prev;

    // Si on saute de plus de 180° dans un sens, on corrige en ajoutant/enlevant 360°
    if (delta > 180) {
      current -= 360;
    } else if (delta < -180) {
      current += 360;
    }

    unwrapped.push(current);
  }
  return unwrapped;
}

const planeRotations = unwrapAngles(getPlaneRotations(planePath));

const PLANE_DURATION = 14;
const PLANE_REPEAT_DELAY = 2;
const HOVER_MAX_DURATION_MS = 3000; // max 3s en ralenti, puis retour vitesse normale
const HOVER_BLOCKED_DURATION_MS = 3000; // après ça, hover bloqué pendant 3s
const SEGMENT_SIZE = 5; // Nombre de points par segment pour la traînée
const TRAIL_DELAY = 0.5; // Délai (s) avant apparition de la traînée après le passage de l'avion
const TRAIL_FADE_DURATION = 0.5; // Durée (s) du fade de la traînée
const keyframes = Array.from({ length: planePath.length }, (_, i) => i / (planePath.length - 1));

function PlaneAlongPath({
  duration,
  isHovered,
  setIsHovered,
  progress,
}: {
  duration: number;
  isHovered: boolean;
  setIsHovered: (v: boolean) => void;
  progress: MotionValue<number>;
}) {
  const planeRef = useRef<HTMLDivElement>(null);
  const mousePosRef = useRef({ x: 0, y: 0 });
  const hoverBlockedUntilRef = useRef(0);
  const hoverStartTimeRef = useRef(0);
  const isHoveredRef = useRef(false);
  isHoveredRef.current = isHovered;
  const durationRef = useRef(duration);
  durationRef.current = duration;
  const lastTimeRef = useRef<number>(0);
  const phaseRef = useRef<'animating' | 'delaying'>('animating');
  const delayEndTimeRef = useRef(0);

  const left = useTransform(progress, keyframes, planePath.map((p) => `${p.x}%`));
  const top = useTransform(progress, keyframes, planePath.map((p) => `${p.y}%`));
  const rotate = useTransform(progress, keyframes, planeRotations.map((r) => `${r}deg`));

  // Boucle manuelle : on ne relance jamais l'animation, on change juste la vitesse → plus de saut
  useEffect(() => {
    let rafId: number;
    lastTimeRef.current = performance.now();

    const tick = () => {
      const now = performance.now();
      const deltaSec = (now - lastTimeRef.current) / 1000;
      lastTimeRef.current = now;
      const dur = durationRef.current;

      if (phaseRef.current === 'delaying') {
        if (now >= delayEndTimeRef.current) {
          progress.set(0);
          phaseRef.current = 'animating';
        }
        rafId = requestAnimationFrame(tick);
        return;
      }

      let p = progress.get() + deltaSec / dur;
      if (p >= 1) {
        p = 1;
        progress.set(1);
        phaseRef.current = 'delaying';
        delayEndTimeRef.current = now + PLANE_REPEAT_DELAY * 1000;
      } else {
        progress.set(p);
      }
      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [progress]);

  const handleMouseEnter = () => {
    const now = Date.now();
    if (now < hoverBlockedUntilRef.current) return;
    hoverStartTimeRef.current = now;
    isHoveredRef.current = true;
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    isHoveredRef.current = false;
    setIsHovered(false);
  };

  // Mise à jour de la position du curseur
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mousePosRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  // Un seul intervalle (monté une fois) : lit les refs pour éviter les closures périmées
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isHoveredRef.current) return;
      const now = Date.now();
      // Max 3s en hover : forcer sortie et bloquer le hover pendant 3s
      if (now - hoverStartTimeRef.current >= HOVER_MAX_DURATION_MS) {
        isHoveredRef.current = false;
        setIsHovered(false);
        hoverBlockedUntilRef.current = now + HOVER_BLOCKED_DURATION_MS;
        return;
      }
      const planeEl = planeRef.current;
      if (!planeEl) return;
      const rect = planeEl.getBoundingClientRect();
      const { x, y } = mousePosRef.current;
      const padding = 8;
      const inside =
        x >= rect.left - padding &&
        x <= rect.right + padding &&
        y >= rect.top - padding &&
        y <= rect.bottom + padding;
      if (!inside) {
        isHoveredRef.current = false;
        setIsHovered(false);
      }
    }, 500);
    return () => clearInterval(interval);
  }, [setIsHovered]);

  return (
    <div className="absolute inset-0 z-0">
      <motion.div
        ref={planeRef}
        className="absolute w-10 h-10 sm:w-12 sm:h-12 -translate-x-1/2 -translate-y-1/2 cursor-pointer"
        style={{ left, top }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <motion.div
          className="w-full h-full"
          style={{ rotate, transformOrigin: 'center center' }}
        >
          <Image
            src="/avion.png"
            alt=""
            width={48}
            height={48}
            className="w-full h-full object-contain opacity-90 drop-shadow-sm"
          />
        </motion.div>
      </motion.div>
    </div>
  );
}

interface TrailSegmentProps {
  segmentPath: string;
  startIdx: number;
  progress: MotionValue<number>;
  duration: number;
}

function TrailSegment({ segmentPath, startIdx, progress, duration }: TrailSegmentProps) {
  // Position du segment le long de la trajectoire (0 -> début, 1 -> fin)
  const segmentProgress = startIdx / planePath.length;

  // Convertit les délais temporels (en secondes) en positions de progress [0,1]
  const appearProgress = Math.min(1, segmentProgress + TRAIL_DELAY / duration);
  const disappearProgress = Math.min(1, appearProgress + TRAIL_FADE_DURATION / duration);

  const times: number[] = [];
  const values: number[] = [];

  if (appearProgress > 0) {
    times.push(0);
    values.push(0);
  }

  if (appearProgress < 1) {
    times.push(Math.max(0, appearProgress - 0.001));
    values.push(0);

    times.push(appearProgress);
    values.push(1);

    if (disappearProgress < 1) {
      times.push(disappearProgress);
      values.push(1);

      times.push(Math.min(1, disappearProgress + 0.001));
      values.push(0);
    }
  }

  if (disappearProgress >= 1) {
    times.push(1);
    values.push(0);
  }

  const opacity = useTransform(
    progress,
    times.length > 0 ? times : [0, 1],
    values.length > 0 ? values : [0, 0]
  );

  return (
    <motion.path
      d={segmentPath}
      fill="none"
      stroke="#2563eb"
      strokeWidth="0.4"
      strokeDasharray="2 1"
      strokeLinecap="round"
      style={{
        opacity,
        filter: 'drop-shadow(0 0 1px rgba(37, 99, 235, 0.6))',
      }}
    />
  );
}

// Ordre au hover : 1 gants (gauche), 2 riz (droite)
const HEAD_HOVER_IMAGES = [
  { src: '/gants-bleu.png', alt: 'Gants', id: 'gants', label: 'MMA / Grappling fan.' },
  { src: '/riz.png', alt: 'Riz', id: 'riz', label: 'Riz.' },
] as const;

export default function Hero({ 
  profileImage = '/photo_racim.png', 
  description = 'Si Smail Racim, Étudiant Ingénieur. Je ne fais pas que coder, je conçois des solutions. Fort d\'une maîtrise technique concrète (IA/Automation), je souhaite désormais appliquer cette rigueur opérationnelle au domaine de l\'Informatique et Ingénierie Mathématique.' 
}: HeroProps) {
  const planeProgress = useMotionValue(0);
  const [isPlaneHovered, setIsPlaneHovered] = useState(false);
  const planeDuration = isPlaneHovered ? PLANE_DURATION * 2 : PLANE_DURATION;
  const [headHoverIndex, setHeadHoverIndex] = useState(0);
  const [isHeadHovered, setIsHeadHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [mobileActiveIndex, setMobileActiveIndex] = useState<-1 | 0 | 1>(-1);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 639px)');
    setIsMobile(mq.matches);
    const handler = () => setIsMobile(mq.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  // Créer des segments de traînée qui apparaissent progressivement
  // Chaque segment apparaît 0.5s après le passage de l'avion et disparaît en 0.5s
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-white overflow-hidden">
      {/* Traînée bleue hachurée derrière l'avion */}
      <div className="absolute inset-0 pointer-events-none z-0" aria-hidden>
        <svg 
          className="absolute inset-0 w-full h-full" 
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          style={{ overflow: 'visible' }}
        >
          {Array.from({ length: Math.floor(planePath.length / SEGMENT_SIZE) }).map((_, segmentIndex) => {
            const startIdx = segmentIndex * SEGMENT_SIZE;
            const endIdx = Math.min(startIdx + SEGMENT_SIZE, planePath.length - 1);
            const segmentPath = planePath.slice(startIdx, endIdx + 1)
              .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`)
              .join(' ');

            return (
              <TrailSegment
                key={segmentIndex}
                segmentPath={segmentPath}
                startIdx={startIdx}
                progress={planeProgress}
                duration={planeDuration}
              />
            );
          })}
        </svg>
      </div>

      {/* Avion en papier animé le long du path avec rotation selon la tangente */}
      <PlaneAlongPath
        duration={planeDuration}
        isHovered={isPlaneHovered}
        setIsHovered={setIsPlaneHovered}
        progress={planeProgress}
      />
      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        {/* Profile Image with Overlapping Button + images derrière la tête */}
        <div className="relative mb-8 flex flex-col items-center overflow-visible">
          {/* Wrapper même taille que la tête pour ne pas déplacer le bouton — overflow-visible pour les images qui dépassent */}
          <div className="relative w-[180px] h-[180px] sm:w-[220px] sm:h-[220px] flex items-center justify-center overflow-visible">
            {/* Gants = milieu gauche, Riz = milieu droite — on ne voit qu'une petite portion */}
            {HEAD_HOVER_IMAGES.map((img, index) => {
              const isActive = isMobile
                ? mobileActiveIndex === index
                : isHeadHovered && index === headHoverIndex;
              const configs = [
                {
                  wrapper: { left: '28%', top: '50%', transform: 'translate(-50%, -50%)' },
                  animate: {
                    rotate: isActive ? -21 : 0,
                    x: isActive ? -76 : 0,
                    scale: isActive ? 1.5 : 0.9,
                  },
                  labelOffset: { x: -36, y: -18 },
                },
                {
                  wrapper: { right: '28%', top: '50%', transform: 'translate(50%, -50%)' },
                  animate: {
                    rotate: isActive ? 21 : 0,
                    x: isActive ? 76 : 0,
                    scale: isActive ? 1.5 : 0.9,
                  },
                  labelOffset: { x: 24, y: -12 },
                },
              ];
              const cfg = configs[index];
              const lo = cfg.labelOffset ?? { x: 0, y: -28 };
              const labelAnimate = {
                ...cfg.animate,
                x: (typeof cfg.animate.x === 'number' ? cfg.animate.x : 0) + lo.x,
                y: lo.y,
                opacity: isActive ? 1 : 0,
              };
              return (
                <div
                  key={img.src}
                  className="absolute w-14 h-14 sm:w-16 sm:h-16 pointer-events-none"
                  style={{ ...cfg.wrapper, zIndex: 1 }}
                >
                  <motion.div
                    className="relative w-full h-full"
                    initial={false}
                    animate={cfg.animate}
                    transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                  >
                    <Image
                      src={img.src}
                      alt={img.alt}
                      fill
                      className="object-contain drop-shadow-md"
                    />
                  </motion.div>
                  {/* Texte avec la même translation/rotation que l'image, décalé au-dessus */}
                  <motion.div
                    className="absolute left-1/2 bottom-full mb-0.5 -translate-x-1/2 whitespace-nowrap text-blue-600 text-[10px] sm:text-xs font-medium"
                    style={{ fontFamily: 'var(--font-canela-deck)' }}
                    initial={false}
                    animate={labelAnimate}
                    transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                  >
                    {img.label}
                  </motion.div>
                </div>
              );
            })}
            <div
              className="relative w-[180px] h-[180px] sm:w-[220px] sm:h-[220px] rounded-full overflow-hidden border-4 border-gray-100 shadow-lg bg-white z-10 cursor-pointer touch-manipulation"
              onMouseEnter={() => !isMobile && setIsHeadHovered(true)}
              onMouseLeave={() => {
                if (!isMobile) {
                  setIsHeadHovered(false);
                  setHeadHoverIndex((i) => (i + 1) % HEAD_HOVER_IMAGES.length);
                }
              }}
              onClick={() => {
                if (isMobile) {
                  setMobileActiveIndex((i): -1 | 0 | 1 => (i === 1 ? -1 : (i + 1) as 0 | 1));
                }
              }}
              role={isMobile ? 'button' : undefined}
              aria-label={isMobile ? 'Afficher un détail' : undefined}
            >
              <Image
                src={profileImage}
                alt="Profile"
                fill
                className="object-cover"
                priority
                style={{ objectPosition: 'center 35%', transform: 'scale(0.90)' }}
              />
            </div>
          </div>

          {/* Overlapping Button — collé sous la tête, largeur fixe centrée */}
          <div className="relative -mt-8 z-20 flex justify-center">
            <AuditButton
              text="Contacte Moi"
              width={200}
              height={50}
              fontSize={16}
              link="#contact"
            />
          </div>

        </div>

        {/* Headline and Description */}
        <div className="mt-8 sm:mt-12 max-w-2xl mx-auto px-1">
          {/* Headline with Canela Deck */}
          <h1 
            className="text-xl sm:text-2xl md:text-3xl font-normal text-black leading-tight mb-4 sm:mb-6"
            style={{ fontFamily: 'var(--font-canela-deck)' }}
          >
            Si Smail Racim,{' '}
            <span className="text-blue-600 relative inline-block">
              Étudiant Ingénieur
              {/* Soulignement ascendant - trait unique fluide */}
              <svg 
                className="absolute bottom--1.2 left-0 w-full h-3"
                viewBox="0 0 240 15" 
                preserveAspectRatio="none"
                style={{ overflow: 'visible' }}
              >
                {/* Courbe convexe plus marquée */}
                <path 
                  d="M 5 13 C 60 10, 120 4, 235 7" 
                  stroke="#2563eb" 
                  strokeWidth="8" 
                  fill="none" 
                  strokeLinecap="round"
                />
              </svg>
            </span>
          </h1>
          
          {/* Subtitle with Inter */}
          <p 
            className="text-sm sm:text-base text-black leading-relaxed"
            style={{ fontFamily: 'var(--font-inter), Inter, sans-serif' }}
          >
            {(() => {
              const text = description;
              // Extract the part after "Étudiant Ingénieur."
              const etudiantIndex = text.indexOf('Étudiant Ingénieur');
              const restOfText = etudiantIndex !== -1 
                ? text.substring(etudiantIndex + 'Étudiant Ingénieur'.length + 1).trim()
                : text;
              
              const parts = [];
              let lastIndex = 0;
              
              // Find "Informatique et Ingénierie Mathématique"
              const highlightStr = 'Informatique et Ingénierie Mathématique';
              const mathIndex = restOfText.indexOf(highlightStr);
              if (mathIndex !== -1) {
                if (mathIndex > lastIndex) {
                  parts.push(restOfText.substring(lastIndex, mathIndex));
                }
                parts.push(<span key="math" className="text-blue-600">{highlightStr}</span>);
                lastIndex = mathIndex + highlightStr.length;
              }
              
              // Add remaining text
              if (lastIndex < restOfText.length) {
                parts.push(restOfText.substring(lastIndex));
              }
              
              // If no highlights found, return original text
              return parts.length > 0 ? parts : restOfText;
            })()}
          </p>
        </div>
      </div>

      {/* Animated Arrow - renvoie vers la section projets */}
      <a
        href="#projects"
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 cursor-pointer hover:opacity-80 transition-opacity"
        aria-label="Voir les projets"
        onClick={(e) => {
          e.preventDefault();
          document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
        }}
      >
        <motion.div
          animate={{
            y: [0, 8, 0],
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M7 10L12 15L17 10"
              stroke="rgba(37, 99, 235, 0.5)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </motion.div>
      </a>
    </section>
  );
}
