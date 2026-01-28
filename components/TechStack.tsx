'use client';

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

// Simple logo components using text/icons
const TechLogo = ({ name }: { name: string }) => {
  const logoMap: Record<string, string> = {
    'PostgreSQL': '🐘',
    'Python': '🐍',
    'C++': '⚙️',
    'JS/JSON': '📜',
    'Figma': '🎨',
    'n8n': '🔗',
    'Supabase': '⚡',
    'ClaudeCode': '🤖',
  };

  return (
    <div className="flex items-center justify-center w-16 h-16 text-3xl">
      {logoMap[name] || name.charAt(0)}
    </div>
  );
};

export default function TechStack({ techItems = defaultTechItems }: TechStackProps) {
  // Create logo items for LogoLoop
  const logoItems = [
    { node: <TechLogo name="Python" />, title: 'Python' },
    { node: <TechLogo name="C++" />, title: 'C++' },
    { node: <TechLogo name="JS/JSON" />, title: 'JavaScript' },
    { node: <TechLogo name="PostgreSQL" />, title: 'PostgreSQL' },
    { node: <TechLogo name="Supabase" />, title: 'Supabase' },
    { node: <TechLogo name="Figma" />, title: 'Figma' },
    { node: <TechLogo name="ClaudeCode" />, title: 'MCP' },
  ];

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

        {/* LogoLoop Section */}
        <div className="mt-16">
          <h3 className="text-2xl font-semibold text-center text-blue-600 mb-8">
            Technologies
          </h3>
          <div className="h-24">
            <LogoLoop
              logos={logoItems}
              speed={100}
              direction="left"
              logoHeight={60}
              gap={60}
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
