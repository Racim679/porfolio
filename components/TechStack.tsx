'use client';

import { useMemo } from 'react';
import LogoLoop from './LogoLoop';

interface TechItem {
  name: string;
  mastery: number; // 0-100
}

interface TechStackProps {
  techItems?: TechItem[];
}

const defaultTechItems: TechItem[] = [
  { name: 'PostgreSQL', mastery: 85 },
  { name: 'Python', mastery: 90 },
  { name: 'C++', mastery: 75 },
  { name: 'JS/JSON', mastery: 88 },
  { name: 'Figma', mastery: 80 },
  { name: 'n8n', mastery: 70 },
  { name: 'Supabase', mastery: 85 },
  { name: 'ClaudeCode', mastery: 75 },
];

export default function TechStack({ techItems = defaultTechItems }: TechStackProps) {
  // Mapping des logos avec leurs chemins
  const logoPathMap: Record<string, string> = {
    'PostgreSQL': '/postgresql-database-logo-application-software-computer-software-mysql-logo-thumbnail.png',
    'Python': '/python-logo-transparent-15.png',
    'JS/JSON': '/logo-javascript-icon-256.png',
    'Supabase': '/supabase-logo-png_seeklogo-435677.png',
    'Figma': '/figma.png',
    'Framer': '/framer.png',
  };

  // Create logo items for LogoLoop - séquence fixe et ordonnée
  // Ordre défini explicitement pour garantir la cohérence
  const logoItems = useMemo(() => {
    // Ordre fixe défini explicitement - correspond à l'ordre attendu
    const fixedOrder = ['PostgreSQL', 'Python', 'JS/JSON', 'Supabase', 'Figma', 'Framer'];
    
    // Vérifier que tous les logos existent dans le mapping
    const items = fixedOrder
      .filter(techName => {
        const exists = logoPathMap[techName] !== undefined;
        if (!exists) {
          console.warn(`Logo manquant pour: ${techName}`);
        }
        return exists;
      })
      .map(techName => ({
        src: logoPathMap[techName],
        alt: techName,
        title: techName,
        width: 60,
        height: 60
      }));
    
    return items;
  }, []);

  return (
    <section id="tech-stack" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl sm:text-4xl font-bold text-center text-blue-600 mb-12">
          Tech Stack
        </h2>

        {/* Tech Stack Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {techItems.map((tech) => (
            <div
              key={tech.name}
              className="bg-white rounded-lg p-6 shadow-sm border border-gray-200"
            >
              <h3 className="text-lg font-semibold text-blue-600 mb-4">
                {tech.name}
              </h3>
              
              {/* Mastery Bar */}
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-500"
                  style={{ width: `${tech.mastery}%` }}
                />
              </div>
              
              <p className="text-sm text-blue-600 mt-2">{tech.mastery}%</p>
            </div>
          ))}
        </div>

        {/* LogoLoop Section - conteneur isolé pour éviter que le contenu déborde dans la loop */}
        <div className="mt-16">
          <h3 className="text-2xl font-semibold text-center text-blue-600 mb-8">
            Technologies
          </h3>
          <div className="h-24 flex items-center overflow-hidden w-full" style={{ contain: 'layout paint' }}>
            <LogoLoop
              logos={logoItems}
              speed={100}
              direction="left"
              logoHeight={60}
              gap={150}
              hoverSpeed={0}
              scaleOnHover
              fadeOut
              fadeOutColor="#ffffff"
              ariaLabel="Technology logos"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
