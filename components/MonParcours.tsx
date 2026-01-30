'use client';

import BlurText from './BlurText';

export interface ParcoursStep {
  year: string;
  title: string;
  subtitle?: string;
  description?: string;
  link?: { url: string; label: string };
}

const defaultSteps: ParcoursStep[] = [
  {
    year: '2021–2022',
    title: 'CCNA Cisco & bureautique',
    subtitle: 'Seconde · Centre de formation',
    description: 'Formation CCNA en accélérée (hors certification officielle) pour découvrir les réseaux et plusieurs secteurs de l\'informatique. Formation complémentaire en bureautique : Excel, PowerPoint, etc. Une base qui m\'a ouvert des perspectives et une compréhension plus globale des enjeux en info.',
  },
  {
    year: '2023',
    title: 'ML & IA – initiation',
    subtitle: 'Code 213, Alger',
    description: 'Formation introductive en Machine Learning et Intelligence Artificielle à l\'école de formation aux métiers du digital Code 213.',
    link: { url: 'https://code213.tech/', label: 'Code 213' },
  },
  {
    year: '2024',
    title: 'Baccalauréat',
    description: 'Parcours lycée, orientation vers les sciences et l\'ingénierie.',
  },
  {
    year: '2024 – aujourd\'hui',
    title: 'Prépa intégrée',
    subtitle: 'Polytech Paris-Saclay · Cycle ingénieur',
    description: 'Formation en informatique et ingénierie mathématique. Projets personnels (web, automatisation, IA) en parallèle.',
  },
];

interface MonParcoursProps {
  steps?: ParcoursStep[];
}

export default function MonParcours({ steps = defaultSteps }: MonParcoursProps) {
  return (
    <section id="parcours" className="py-20 sm:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <BlurText
          as="h2"
          text="Mon parcours"
          className="text-4xl sm:text-5xl font-normal tracking-tight text-blue-600 mb-16 text-center"
          style={{ fontFamily: 'var(--font-canela-deck)' }}
          animateBy="words"
          delay={150}
        />

        <div className="relative max-w-2xl mx-auto">
          {/* Ligne verticale */}
          <div
            className="absolute left-[11px] sm:left-[13px] top-0 bottom-0 w-0.5 bg-blue-200"
            aria-hidden
          />
          <ul className="space-y-10">
            {steps.map((step, index) => (
              <li key={index} className="relative flex gap-6 pl-10 sm:pl-12">
                {/* Point sur la ligne */}
                <span
                  className="absolute left-0 top-1.5 w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-blue-600 border-4 border-white shadow-sm"
                  aria-hidden
                />
                <div
                  className="pt-0.5 text-gray-900"
                  style={{ fontFamily: 'var(--font-inter), Inter, sans-serif' }}
                >
                  <span className="text-sm font-medium text-blue-600">
                    {step.year}
                  </span>
                  <h3
                    className="mt-1 text-lg sm:text-xl font-semibold text-black"
                    style={{ fontFamily: 'var(--font-canela-deck)' }}
                  >
                    {step.title}
                  </h3>
                  {step.subtitle && (
                    <p className="text-sm text-gray-600 mt-0.5">{step.subtitle}</p>
                  )}
                  {step.description && (
                    <p className="mt-2 text-sm sm:text-base leading-relaxed text-gray-700">
                      {step.description}
                    </p>
                  )}
                  {step.link && (
                    <a
                      href={step.link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block mt-2 text-sm font-medium text-blue-600 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-400 rounded"
                    >
                      {step.link.label} →
                    </a>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
