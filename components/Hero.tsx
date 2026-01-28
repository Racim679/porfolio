'use client';

import Image from 'next/image';
import AuditButton from './AuditButton';
import { motion } from 'framer-motion';

interface HeroProps {
  profileImage?: string;
  description?: string;
}

export default function Hero({ 
  profileImage = '/photo_racim.png', 
  description = 'Si Smail Racim, Étudiant Ingénieur. Je ne fais pas que coder, je conçois des solutions. Fort d\'une maîtrise technique concrète (IA/Automation), je souhaite désormais appliquer cette rigueur opérationnelle au domaine des mathématiques appliquées.' 
}: HeroProps) {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-white overflow-hidden">
      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        {/* Profile Image with Overlapping Button */}
        <div className="relative mb-8 flex flex-col items-center">
          <div className="relative w-[180px] h-[180px] sm:w-[220px] sm:h-[220px] rounded-full overflow-hidden border-4 border-gray-100 shadow-lg bg-white">
            <Image
              src={profileImage}
              alt="Profile"
              fill
              className="object-cover"
              priority
              style={{ objectPosition: 'center 35%', transform: 'scale(0.90)' }}
            />
          </div>
          
          {/* Overlapping Button */}
          <div className="relative -mt-8 z-20">
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
        <div className="mt-12 max-w-2xl mx-auto">
          {/* Headline with Canela Deck */}
          <h1 
            className="text-2xl sm:text-3xl font-normal text-black leading-tight mb-6"
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
              
              // Find "mathématiques appliquées"
              const mathIndex = restOfText.indexOf('mathématiques appliquées');
              if (mathIndex !== -1) {
                // Add text before "mathématiques appliquées"
                if (mathIndex > lastIndex) {
                  parts.push(restOfText.substring(lastIndex, mathIndex));
                }
                // Add highlighted "mathématiques appliquées"
                parts.push(<span key="math" className="text-blue-600">mathématiques appliquées</span>);
                lastIndex = mathIndex + 'mathématiques appliquées'.length;
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

      {/* Animated Arrow */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10"
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
    </section>
  );
}
