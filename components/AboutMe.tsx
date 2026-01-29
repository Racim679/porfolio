'use client';

import Image from 'next/image';

interface AboutMeProps {
  photo?: string;
  tagline?: string;
  paragraph1?: string;
  paragraph2?: string;
}

const defaultContent = {
  tagline: "Je conçois et construis des solutions numériques qui transforment les idées en réalité.",
  paragraph1: "Étudiant ingénieur en 2e année de prépa, je travaille sur des projets concrets : plateformes web, automatisations (n8n), applications et solutions sur mesure. Je prends en charge tout le cycle, de la conception au déploiement, pour des résultats à la fois soignés et opérationnels.",
  paragraph2: "Porté par la curiosité et l’envie de bien faire, je m’investis dans des solutions sur mesure pour les startups et les entreprises. Maîtrise technique (IA, automation, dev full-stack) et rigueur au service de résultats mesurables. Une idée à concrétiser ? Parlons-en.",
};

export default function AboutMe({
  photo = '/photo_racim.png',
  tagline = defaultContent.tagline,
  paragraph1 = defaultContent.paragraph1,
  paragraph2 = defaultContent.paragraph2,
}: AboutMeProps) {
  return (
    <section id="about" className="py-20 sm:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Texte à gauche, photo à droite — alignés en hauteur */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          <div className="lg:col-span-6 flex flex-col gap-6">
            <h2
              className="text-4xl sm:text-5xl lg:text-6xl font-normal tracking-tight text-blue-600 mb-8"
              style={{ fontFamily: 'var(--font-canela-deck)' }}
            >
              About me
            </h2>
            <div
              className="space-y-6 text-gray-900 text-base sm:text-lg leading-relaxed"
              style={{ fontFamily: 'var(--font-inter), Inter, sans-serif' }}
            >
              <p className="font-semibold text-lg sm:text-xl text-black">
                {tagline}
              </p>
              <p>
                {paragraph1}
              </p>
              <p>
                {paragraph2}
              </p>
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
