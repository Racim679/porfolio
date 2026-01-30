'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const GREETINGS = ['Hola !', '你好 !', 'Bonjour !', 'مرحبا', 'Hello !', 'Здравствуйте !'];
const WORD_DURATION_MS = 300; // entre chaque mot
const OVERLAY_TEXT_PHASE_MS = 1800; // durée totale de la phase texte (1,8 s) avant le slide up
const SLIDE_UP_DURATION_S = 0.5;

export default function IntroOverlay() {
  const [wordIndex, setWordIndex] = useState(0);
  const [isExiting, setIsExiting] = useState(false);
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    const advance = setInterval(() => {
      setWordIndex((i) => {
        if (i >= GREETINGS.length - 1) {
          clearInterval(advance);
          return i;
        }
        return i + 1;
      });
    }, WORD_DURATION_MS);
    return () => clearInterval(advance);
  }, []);

  useEffect(() => {
    const exitTimer = setTimeout(() => setIsExiting(true), OVERLAY_TEXT_PHASE_MS);
    return () => clearTimeout(exitTimer);
  }, []);

  useEffect(() => {
    if (!isExiting) return;
    const doneTimer = setTimeout(
      () => setIsDone(true),
      SLIDE_UP_DURATION_S * 1000
    );
    return () => clearTimeout(doneTimer);
  }, [isExiting]);

  // Bloquer le scroll pendant l'overlay
  useEffect(() => {
    if (!isDone) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isDone]);

  if (isDone) return null;

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-white"
      initial={false}
      animate={{
        y: isExiting ? '-100%' : 0,
      }}
      transition={{
        duration: SLIDE_UP_DURATION_S,
        ease: [0.25, 0.1, 0.25, 1],
      }}
    >
      <span
        className="text-2xl sm:text-4xl md:text-4xl lg:text-5xl text-blue-400 select-none"
        style={{ fontFamily: 'var(--font-canela-deck)' }}
      >
        {GREETINGS[wordIndex]}
      </span>
    </motion.div>
  );
}
