'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import BlurText from './BlurText';
import SplitText from './SplitText';
import AuditButton from './AuditButton';

interface AboutMeProps {
  photo?: string;
  tagline?: string;
  paragraph1?: string;
  paragraph2?: string;
}

const defaultContent = {
  tagline: "En formation, je me construis en pratiquant : web, automatisation, applications.",
  paragraph1: "Étudiant en 2e année de prépa, je m’exerce sur des projets perso (sites web, n8n, petits outils) pour apprendre. Je découvre le cycle conception–déploiement en le faisant.",
  paragraph2: "Curieux et motivé, je veux continuer à m’éduquer pendant mon cycle ingénieur et surtout en alternance : apprendre sur le terrain, en entreprise, en faisant. Je recherche une alternance pour grandir en pratique à vos côtés.",
};

export default function AboutMe({
  photo = '/photo_racim.png',
  tagline = defaultContent.tagline,
  paragraph1 = defaultContent.paragraph1,
  paragraph2 = defaultContent.paragraph2,
}: AboutMeProps) {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 639px)');
    setIsMobile(mq.matches);
    const handler = () => setIsMobile(mq.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  return (
    <section id="about" className="py-20 sm:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Texte à gauche, photo à droite — alignés en hauteur */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          <div className="lg:col-span-6 flex flex-col gap-6">
            <BlurText
              as="h2"
              text="About me"
              className="text-4xl sm:text-5xl font-normal tracking-tight text-blue-600 mb-8"
              style={{ fontFamily: 'var(--font-canela-deck)' }}
              animateBy="words"
              delay={150}
            />
            <div
              className="space-y-6 text-gray-900 text-sm sm:text-base leading-relaxed"
              style={{ fontFamily: 'var(--font-inter), Inter, sans-serif' }}
            >
              <SplitText
                as="p"
                text={tagline}
                className="font-semibold text-lg sm:text-xl text-black"
                style={{ fontFamily: 'var(--font-canela-deck)' }}
                splitType="words"
                delay={80}
                duration={0.5}
              />
              <p>
                {paragraph1}
              </p>
              <p>
                {(() => {
                  const highlight = 'Je recherche une alternance';
                  const i = paragraph2.indexOf(highlight);
                  if (i === -1) return paragraph2;
                  return (
                    <>
                      {paragraph2.slice(0, i)}
                      <span className="text-blue-600">{highlight}</span>
                      {paragraph2.slice(i + highlight.length)}
                    </>
                  );
                })()}
              </p>
            </div>
            <div className="mt-6">
              <AuditButton
                text="Contacte Moi"
                width={isMobile ? 160 : 200}
                height={isMobile ? 44 : 50}
                fontSize={isMobile ? 14 : 16}
                link="#contact"
                className="cursor-cta"
              />
            </div>
          </div>
          <div className="lg:col-span-6 flex justify-center lg:justify-end">
            <div className="relative w-full max-w-md aspect-[4/5] rounded-2xl overflow-hidden border border-gray-100 shadow-lg">
              <Image
                src={photo}
                alt="Racim Si Smail"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority={false}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
