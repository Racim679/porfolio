import { notFound } from 'next/navigation';
import { createSupabaseClient, ProjectWithRelations, addCacheBusting } from '@/lib/supabase';
import ProjectImageCarousel from '@/components/ProjectImageCarousel';
import Navbar from '@/components/Navbar';
import SplitText from '@/components/SplitText';

interface ProjectPageProps {
  params: Promise<{
    slug: string;
  }>;
}

function mapFromSupabase(row: ProjectWithRelations) {
  // Récupérer les images depuis project_images
  let images = row.project_images
    ?.sort((a, b) => a.order_index - b.order_index)
    .map((img) => ({
      url: addCacheBusting(img.image_url, row.updated_at),
      alt: img.alt_text || row.title,
    }))
    .filter((img): img is { url: string; alt: string } => img.url !== undefined && img.url !== '') || [];

  // Si aucune image dans project_images, utiliser main_image_url
  if (images.length === 0 && row.main_image_url) {
    const mainImageUrl = addCacheBusting(row.main_image_url, row.updated_at);
    if (mainImageUrl) {
      images = [{
        url: mainImageUrl,
        alt: row.title,
      }];
    }
  }

  const feedback =
    row.project_feedback && row.project_feedback.length > 0
      ? row.project_feedback[0]
      : null;

  const metrics = row.project_metrics?.sort(
    (a, b) => a.order_index - b.order_index,
  ) || [];

  return { row, images, feedback, metrics };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  // Dans Next.js 15+, params est une Promise
  const { slug } = await params;
  
  if (!slug) {
    notFound();
  }

  const supabase = createSupabaseClient();

  // Essayer d'abord sans .single() pour voir tous les résultats
  const { data, error } = await supabase
    .from('projects')
    .select(
      `
      *,
      project_images (*),
      project_feedback (*),
      project_metrics (*)
    `,
    )
    .eq('slug', slug)
    .eq('published', true);

  // Vérifier s'il y a une erreur ou aucun résultat
  if (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Erreur Supabase:', error);
      console.error('Slug recherché:', slug);
    }
    notFound();
  }

  // Si pas de données ou tableau vide, projet non trouvé
  if (!data || data.length === 0) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Aucune donnée trouvée pour slug:', slug);
      // Essayer de lister tous les slugs disponibles pour debug
      const { data: allProjects } = await supabase
        .from('projects')
        .select('slug, title, published')
        .eq('published', true);
      console.log('Projets disponibles:', allProjects?.map(p => p.slug));
    }
    notFound();
  }

  // Prendre le premier résultat (devrait être unique grâce au slug)
  const projectData = data[0];

  const { row, images, feedback, metrics } = mapFromSupabase(
    projectData as ProjectWithRelations,
  );

  // Définir le lien CMS - utiliser des liens spécifiques pour certains projets
  const cmsLink =
    row.slug === 'gr-dental-clinic'
      ? 'https://grdentalclinickouba.com/'
      : row.slug === 'ami-immo'
        ? 'https://ami-immobilier.lovable.app/'
        : row.cms_link;

  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        <SplitText
          as="h1"
          text={row.title}
          className="text-3xl sm:text-4xl font-normal text-blue-600 mb-6"
          style={{ fontFamily: 'var(--font-canela-deck)' }}
          splitType="words"
          delay={60}
          duration={0.5}
        />

        <p
          className="text-sm sm:text-base md:text-lg text-gray-800 leading-relaxed mb-10 break-words"
          style={{ fontFamily: 'var(--font-inter), Inter, sans-serif' }}
        >
          {row.description}
        </p>

        {images && images.length > 0 && (
          <ProjectImageCarousel images={images} projectTitle={row.title} />
        )}

        {(metrics && metrics.length > 0) || feedback ? (
          <section className="mb-12 grid gap-8 sm:grid-cols-[minmax(0,1.3fr)_minmax(0,1.7fr)]">
            {metrics && metrics.length > 0 && (
              <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                <h2
                  className="text-lg font-medium text-blue-600 mb-4"
                  style={{ fontFamily: 'var(--font-canela-deck)' }}
                >
                  Résultats clés
                </h2>
                <div className="space-y-3">
                  {metrics.map((m) => (
                    <div
                      key={m.id}
                      className="flex items-baseline justify-between gap-4"
                    >
                      <span className="text-sm text-gray-600">
                        {m.label}
                      </span>
                      <span className="text-base font-semibold text-blue-600">
                        {m.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {feedback && (
              <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                <h2
                  className="text-lg font-medium text-blue-600 mb-4"
                  style={{ fontFamily: 'var(--font-canela-deck)' }}
                >
                  Retour client
                </h2>
                <p
                  className="text-gray-800 italic mb-3"
                  style={{ fontFamily: 'var(--font-inter), Inter, sans-serif' }}
                >
                  “{feedback.quote}”
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-semibold">{feedback.author}</span>
                  {feedback.author_role && (
                    <span className="text-gray-500">
                      {' '}
                      — {feedback.author_role}
                    </span>
                  )}
                </p>
              </div>
            )}
          </section>
        ) : null}

        {cmsLink && (
          <a
            href={cmsLink}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center px-6 py-3 rounded-full bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors"
            style={{ fontFamily: 'var(--font-inter), Inter, sans-serif' }}
          >
            Voir la version en ligne
          </a>
        )}
      </div>
    </main>
  );
}

