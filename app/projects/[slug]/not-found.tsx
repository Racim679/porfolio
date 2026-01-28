import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center px-4">
        <h1
          className="text-4xl sm:text-5xl font-normal text-blue-600 mb-4"
          style={{ fontFamily: 'var(--font-canela-deck)' }}
        >
          Projet non trouvé
        </h1>
        <p
          className="text-gray-600 mb-8"
          style={{ fontFamily: 'var(--font-inter), Inter, sans-serif' }}
        >
          Le projet que vous recherchez n'existe pas ou n'est plus disponible.
        </p>
        <Link
          href="/#projects"
          className="inline-flex items-center px-6 py-3 rounded-full bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors"
          style={{ fontFamily: 'var(--font-inter), Inter, sans-serif' }}
        >
          Retour aux projets
        </Link>
      </div>
    </main>
  );
}
