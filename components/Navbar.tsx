'use client';

import { useState, useEffect, useRef } from 'react';
import { FileText } from 'lucide-react';
import { motion, useMotionValueEvent, useScroll } from 'framer-motion';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);
  const scrollThreshold = useRef(0); // Accumulateur pour le seuil de scroll
  const { scrollY } = useScroll();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useMotionValueEvent(scrollY, 'change', (latest) => {
    const currentScrollY = latest;
    const scrollDifference = currentScrollY - lastScrollY.current;

    // Seuil minimum de scroll pour déclencher l'action (130px)
    const SCROLL_THRESHOLD = 130;

    // Scrolling down
    if (scrollDifference > 0 && currentScrollY > 100) {
      scrollThreshold.current += Math.abs(scrollDifference);
      
      // Cache la navbar seulement si on a scrollé suffisamment vers le bas
      if (scrollThreshold.current >= SCROLL_THRESHOLD) {
        setIsVisible(false);
        scrollThreshold.current = 0; // Reset le compteur
      }
    }
    // Scrolling up
    else if (scrollDifference < 0) {
      scrollThreshold.current += Math.abs(scrollDifference);
      
      // Montre la navbar seulement si on a scrollé suffisamment vers le haut
      if (scrollThreshold.current >= SCROLL_THRESHOLD) {
        setIsVisible(true);
        scrollThreshold.current = 0; // Reset le compteur
      }
    }

    lastScrollY.current = currentScrollY;
  });


  return (
    <motion.header
      initial={{ y: 0 }}
      animate={{ y: isVisible ? 0 : -100 }}
      transition={{ duration: 0.6, ease: 'linear' }}
      className={`fixed top-0 left-0 right-0 z-50 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-sm shadow-sm'
          : 'bg-white/80 backdrop-blur-sm'
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-24">
          {/* Logo */}
          <div className="flex-shrink-0 group relative">
            <a href="/" className="flex items-center transition-opacity">
              <img
                src="/logo.png"
                alt="Logo"
                width={52}
                height={52}
                className="object-contain transition-transform duration-300 ease-out group-hover:scale-110"
              />
              
              {/* Text that slides in on hover - Desktop only */}
              <div className="hidden md:flex flex-col overflow-hidden ml-2 group-hover:ml-1.5 transition-all duration-300">
                <span 
                  className="text-xs font-normal text-blue-600 transform translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-500 ease-out whitespace-nowrap"
                  style={{ fontFamily: 'var(--font-canela-deck)' }}
                >
                  racim
                </span>
                <span 
                  className="text-xs font-normal text-blue-600 transform translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-500 ease-out delay-75 whitespace-nowrap"
                  style={{ fontFamily: 'var(--font-canela-deck)' }}
                >
                  si smail
                </span>
              </div>
            </a>
          </div>

          {/* CV Button — télécharge le PDF depuis /public */}
          <a
            href="/cv%20(7).pdf"
            download="CV_Racim_Si_Smail.pdf"
            className="cursor-cta flex items-center gap-2 px-8 py-3 text-base font-medium text-white bg-blue-600 rounded-full hover:bg-blue-700 hover:rotate-[4deg] transition-all duration-300 ease-out shadow-sm"
          >
            <FileText className="w-5 h-5" />
            Mon CV
          </a>
        </div>
      </nav>
    </motion.header>
  );
}
