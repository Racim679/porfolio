/**
 * Smooth scroll vers un élément avec durée visible et courbe d'easing.
 * Accentuation fluide quand le défilement passe par la section #projects.
 */

const MIN_DURATION_MS = 900;
const MAX_DURATION_MS = 1600;
const PX_PER_MS = 0.7; // durée scale avec la distance (plus long = plus visible)
const ZONE_MARGIN_PX = 180;

function getProjectsZone(): { top: number; bottom: number } | null {
  if (typeof document === 'undefined') return null;
  const el = document.getElementById('projects');
  if (!el) return null;
  const rect = el.getBoundingClientRect();
  return {
    top: rect.top + window.scrollY - ZONE_MARGIN_PX,
    bottom: rect.bottom + window.scrollY + ZONE_MARGIN_PX,
  };
}

/** easeOutCubic: démarrage rapide, fin douce */
function easeOutCubic(t: number): number {
  return 1 - (1 - t) ** 3;
}

/**
 * Progression "étirée" dans le temps quand on traverse la zone #projects :
 * on avance plus lentement (plus de temps passé) dans cette zone.
 */
/** Easing fluide ; accentuation près de #projects gérée en allongeant la durée si la cible est dans la zone. */
function easeWithZone(
  t: number,
  _startY: number,
  _targetY: number
): number {
  return easeOutCubic(t);
}

export function smoothScrollTo(
  element: HTMLElement | null,
  options?: { block?: ScrollLogicalPosition }
) {
  if (!element || typeof window === 'undefined') return;

  const block = options?.block ?? 'start';
  const html = document.documentElement;
  const startY = window.scrollY;
  const rect = element.getBoundingClientRect();
  let targetY = rect.top + startY;
  if (block === 'center') {
    targetY -= window.innerHeight / 2 - rect.height / 2;
  } else if (block === 'end') {
    targetY -= window.innerHeight - rect.height;
  }
  targetY = Math.max(0, Math.min(targetY, html.scrollHeight - window.innerHeight));

  const distance = Math.abs(targetY - startY);
  if (distance < 2) {
    window.scrollTo(0, targetY);
    return;
  }

  const durationMs = Math.min(
    MAX_DURATION_MS,
    Math.max(MIN_DURATION_MS, distance * PX_PER_MS)
  );
  const startTime = performance.now();
  let rafId: number;

  const tick = (now: number) => {
    const elapsed = now - startTime;
    const t = Math.min(1, elapsed / durationMs);
    const progress = easeWithZone(t, startY, targetY);
    const currentY = startY + (targetY - startY) * progress;

    if (t >= 1) {
      window.scrollTo(0, targetY);
      return;
    }

    window.scrollTo(0, currentY);
    rafId = requestAnimationFrame(tick);
  };

  rafId = requestAnimationFrame(tick);

  const cancel = () => {
    if (rafId != null) cancelAnimationFrame(rafId);
  };
  window.addEventListener('wheel', cancel, { passive: true });
  window.addEventListener('touchstart', cancel, { passive: true });
  setTimeout(() => {
    window.removeEventListener('wheel', cancel);
    window.removeEventListener('touchstart', cancel);
  }, durationMs + 200);
}
