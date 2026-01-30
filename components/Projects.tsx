'use client';

import { useState, useEffect, useRef } from 'react';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { supabase, ProjectWithRelations, addCacheBusting } from '@/lib/supabase';
import BlurText from './BlurText';

interface ProjectImage {
  url: string;
  alt: string;
}

interface ProjectFeedback {
  quote: string;
  author: string;
  role?: string;
}

interface ProjectMetric {
  label: string;
  value: string;
}

interface Project {
  id: number;
  title: string;
  description: string;
  images?: ProjectImage[];
  mainImage?: string;
  cmsLink?: string;
  feedback?: ProjectFeedback;
  metrics?: ProjectMetric[];
}

interface ProjectsProps {
  projects?: Project[];
}

const defaultProjects: Project[] = [
  {
    id: 1,
    title: 'GR Dental Clinic - Site Web & Coaching Digital',
    description: 'Conception et développement from scratch d\'un site vitrine sur Framer orienté conversion visiteur → patient. Design unique et personnalisé selon l\'identité de la clinique. Production vidéo : tournage et montage. Coaching digital complet pour optimiser la présence en ligne et maximiser les conversions.',
    mainImage: '/projects/gr-dental.jpg',
    cmsLink: '/projects/gr-dental-clinic',
    feedback: {
      quote: 'Un travail exceptionnel qui a transformé notre présence digitale. Les conversions ont augmenté de manière significative.',
      author: 'Dr. Kouba',
      role: 'Fondateur, GR Dental Clinic'
    },
    metrics: [
      { label: 'Conversion', value: '+150%' },
      { label: 'Temps de chargement', value: '<2s' }
    ]
  },
  {
    id: 2,
    title: 'AMI IMMO - Plateforme Immobilière Full-Stack',
    description: 'PWA complète avec React 18, TypeScript et Supabase. Comprend un site de biens immobiliers et un CRM agence avec gestion CRUD, dashboard, alertes qualité, recherche multi-critères, favoris, comparaison, cartes Google Maps et chatbot de prise de rendez-vous via n8n. Optimisations avancées : lazy loading, code splitting, React Query, CI/CD.',
    mainImage: '/projects/ami-immo.jpg',
    cmsLink: '/projects/ami-immo',
    metrics: [
      { label: 'Performance', value: '95/100' },
      { label: 'Utilisateurs actifs', value: '500+' }
    ]
  },
  {
    id: 3,
    title: 'CRM Leads & Call Center',
    description: 'Plateforme dédiée aux leads entrants et au call center avec scraping automatisé (Python, Selenium) vers PostgreSQL. Gestion complète des appels, rappels, scoring, RDV et historique. Système de gamification avec XP, niveaux, streaks et leaderboard. Analytics détaillés : conversions, taux de closing, appels par prospect.',
    mainImage: '/projects/crm-leads.jpg',
    cmsLink: '/projects/crm-leads',
    feedback: {
      quote: 'L\'automatisation du scraping et le système de gamification ont révolutionné notre productivité.',
      author: 'Équipe Commerciale'
    },
    metrics: [
      { label: 'ROI', value: '+200%' },
      { label: 'Temps gagné', value: '40h/semaine' }
    ]
  },
  {
    id: 4,
    title: 'Pipeline d\'Automatisation Multi-Plateforme',
    description: 'Automatisation complète avec n8n et IA pour publication sur YouTube, Instagram, Facebook et site web. Analyse multimodale via Gemini, copywriting bilingue, génération SQL dynamique et orchestration des APIs Meta. ROI impressionnant : -90% de temps (40 → 4 min), x4 sur la diffusion.',
    mainImage: '/projects/automation.jpg',
    cmsLink: '/projects/automation-pipeline',
    metrics: [
      { label: 'Temps économisé', value: '-90%' },
      { label: 'Diffusion', value: 'x4' }
    ]
  },
];

function mapFromSupabase(row: ProjectWithRelations): Project {
  // S'assurer que main_image_url n'est pas vide ou null
  let mainImageUrl: string | undefined = undefined;
  if (row.main_image_url && typeof row.main_image_url === 'string' && row.main_image_url.trim() !== '') {
    const bustedUrl = addCacheBusting(row.main_image_url, row.updated_at);
    if (bustedUrl && bustedUrl.trim() !== '') {
      mainImageUrl = bustedUrl;
    }
  }

  // Filtrer et mapper les images project_images
  const projectImages = row.project_images
    ?.sort((a, b) => a.order_index - b.order_index)
    .map((img) => {
      if (img.image_url && typeof img.image_url === 'string' && img.image_url.trim() !== '') {
        const bustedUrl = addCacheBusting(img.image_url, row.updated_at);
        if (bustedUrl && bustedUrl.trim() !== '') {
          return {
            url: bustedUrl,
            alt: img.alt_text || row.title,
          };
        }
      }
      return null;
    })
    .filter((img): img is ProjectImage => img !== null) || [];

  // Générer le lien CMS - utiliser cms_link si disponible, sinon générer depuis le slug
  let cmsLink: string | undefined = undefined;
  if (row.cms_link && row.cms_link.trim() !== '') {
    cmsLink = row.cms_link;
  } else if (row.slug && row.slug.trim() !== '') {
    cmsLink = `/projects/${row.slug}`;
  }

  return {
    id: row.order_index ?? 0,
    title: row.title,
    description: row.description,
    mainImage: mainImageUrl,
    cmsLink: cmsLink,
    images: projectImages,
    feedback: row.project_feedback && row.project_feedback.length > 0
      ? {
          quote: row.project_feedback[0].quote,
          author: row.project_feedback[0].author,
          role: row.project_feedback[0].author_role || undefined,
        }
      : undefined,
    metrics: row.project_metrics
      ?.sort((a, b) => a.order_index - b.order_index)
      .map((m) => ({
        label: m.label,
        value: m.value,
      })),
  };
}

const MAX_IMAGE_RETRIES = 2; // 1 chargement initial + 2 retries = 3 tentatives
const RETRY_DELAY_MS = 1500;

export default function Projects({ projects: initialProjects = defaultProjects }: ProjectsProps) {
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [failedImageIds, setFailedImageIds] = useState<Set<number>>(new Set());
  const [imageRetryKey, setImageRetryKey] = useState<Record<number, number>>({});
  const retryTimeoutsRef = useRef<Record<number, ReturnType<typeof setTimeout>>>({});
  const [cardCursor, setCardCursor] = useState<{ cardId: number; x: number; y: number } | null>(null);
  const [displayCursor, setDisplayCursor] = useState<{ cardId: number; x: number; y: number } | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const cardCursorRef = useRef<{ cardId: number; x: number; y: number } | null>(null);
  const displayPosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 639px)');
    setIsMobile(mq.matches);
    const handler = () => {
      const mobile = mq.matches;
      setIsMobile(mobile);
      if (mobile) setCardCursor(null);
    };
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  cardCursorRef.current = cardCursor;

  // Suivi du cercle avec latence ~500ms (lerp vers la position du curseur)
  useEffect(() => {
    if (!cardCursor) {
      setDisplayCursor(null);
      if (rafRef.current != null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      return;
    }
    displayPosRef.current = { x: cardCursor.x, y: cardCursor.y };
    setDisplayCursor({ cardId: cardCursor.cardId, x: cardCursor.x, y: cardCursor.y });

    const LERP = 0.08;
    const tick = () => {
      const target = cardCursorRef.current;
      if (target === null) {
        setDisplayCursor(null);
        rafRef.current = null;
        return;
      }
      displayPosRef.current.x += (target.x - displayPosRef.current.x) * LERP;
      displayPosRef.current.y += (target.y - displayPosRef.current.y) * LERP;
      setDisplayCursor({
        cardId: target.cardId,
        x: displayPosRef.current.x,
        y: displayPosRef.current.y,
      });
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    };
  }, [!!cardCursor, cardCursor?.cardId]);

  // Nettoyer les timeouts de retry au démontage
  useEffect(() => {
    return () => {
      Object.values(retryTimeoutsRef.current).forEach(clearTimeout);
      retryTimeoutsRef.current = {};
    };
  }, []);

  useEffect(() => {
    // Récupération des projets depuis Supabase si disponible
    const fetchProjects = async () => {
      try {
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
          .eq('published', true)
          .order('order_index', { ascending: true });

        if (error) {
          // Log en warn pour ne pas déclencher l'overlay d'erreur Next.js ; message lisible au lieu de {}
          console.warn(
            'Supabase: utilisation des projets par défaut.',
            error?.message ?? error?.code ?? String(error)
          );
          return;
        }

        if (!data || data.length === 0) {
          console.log('Aucun projet trouvé dans Supabase, utilisation des projets par défaut');
          return;
        }

        const mapped = (data as ProjectWithRelations[]).map(mapFromSupabase);
        console.log('Projets chargés depuis Supabase:', mapped.map(p => ({ 
          title: p.title, 
          mainImage: p.mainImage, 
          imagesCount: p.images?.length || 0,
          cmsLink: p.cmsLink
        })));

        if (mapped.length > 0) {
          setProjects(mapped);
        }
      } catch {
        // En cas de problème réseau/env, on garde le fallback local
      }
    };

    fetchProjects();
  }, []);

  // Fonction pour obtenir l'image principale d'un projet
  const getMainImage = (project: Project): ProjectImage | null => {
    // Priorité 1: main_image_url depuis Supabase
    if (project.mainImage && typeof project.mainImage === 'string' && project.mainImage.trim() !== '') {
      const url = project.mainImage.trim();
      // Valider que l'URL est soit locale (/...) soit externe (http://... ou https://...)
      if (url.startsWith('/') || url.startsWith('http://') || url.startsWith('https://')) {
        return { url, alt: project.title };
      } else {
        console.warn('URL d\'image invalide pour', project.title, ':', url);
      }
    }
    
    // Priorité 2: première image de project_images
    if (project.images && project.images.length > 0) {
      for (const img of project.images) {
        if (img && img.url && typeof img.url === 'string' && img.url.trim() !== '') {
          const url = img.url.trim();
          if (url.startsWith('/') || url.startsWith('http://') || url.startsWith('https://')) {
            return { url, alt: img.alt || project.title };
          }
        }
      }
    }
    
    return null;
  };

  return (
    <section id="projects" className="pt-10 sm:pt-16 pb-24 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Portfolio Button */}
        <div className="flex justify-center mb-8">
          <div 
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border-2 border-blue-600 text-blue-600 text-sm font-medium"
            style={{ 
              fontFamily: 'var(--font-inter), Inter, sans-serif',
              backgroundColor: 'rgba(37, 99, 235, 0.08)' // bleu clair avec très faible opacité
            }}
          >
            {/* Petit rond avec nuances de bleu */}
            <div className="relative w-2 h-2">
              <div 
                className="absolute inset-0 rounded-full"
                style={{
                  background: 'radial-gradient(circle, rgba(59, 130, 246, 0.9) 0%, rgba(37, 99, 235, 0.7) 50%, rgba(29, 78, 216, 0.5) 100%)'
                }}
              />
            </div>
            <span>Portfolio</span>
          </div>
        </div>

        {/* Section Title */}
        <BlurText
          as="h2"
          text="Mes Projets"
          className="text-4xl sm:text-5xl font-normal text-center text-blue-600 mb-16"
          style={{ fontFamily: 'var(--font-canela-deck)' }}
          animateBy="words"
          delay={180}
        />

        {/* Projects Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {projects.map((project, index) => {
            const mainImage = getMainImage(project);
            const imageFailed = failedImageIds.has(project.id);
            const showImage = mainImage?.url && !imageFailed;

            return (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`group relative rounded-3xl p-8 sm:p-12 overflow-hidden ${isMobile ? 'cursor-default' : 'cursor-pointer'}`}
                style={{
                  background: index % 2 === 0
                    ? 'linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(147, 197, 253, 0.1) 100%)'
                    : 'linear-gradient(135deg, rgba(236, 72, 153, 0.15) 0%, rgba(147, 197, 253, 0.1) 100%)'
                }}
                onMouseMove={isMobile ? undefined : (e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  setCardCursor({
                    cardId: project.id,
                    x: e.clientX - rect.left,
                    y: e.clientY - rect.top,
                  });
                }}
                onMouseLeave={isMobile ? undefined : () => setCardCursor(null)}
              >
                {/* Background blur effect pour la profondeur */}
                <div 
                  className="absolute inset-0 rounded-3xl blur-3xl opacity-30 group-hover:opacity-40 transition-opacity -z-10"
                  style={{
                    background: index % 2 === 0 
                      ? 'linear-gradient(135deg, rgba(59, 130, 246, 0.4) 0%, rgba(147, 197, 253, 0.3) 100%)'
                      : 'linear-gradient(135deg, rgba(236, 72, 153, 0.4) 0%, rgba(147, 197, 253, 0.3) 100%)'
                  }}
                />

                {/* Cercle "Voir" au survol — suit le curseur avec latence ~500ms (désactivé sur mobile) */}
                {!isMobile && displayCursor?.cardId === project.id && (
                  <div
                    className="absolute pointer-events-none z-20 w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-white shadow-xl flex items-center justify-center -translate-x-1/2 -translate-y-1/2"
                    style={{
                      left: displayCursor.x,
                      top: displayCursor.y,
                      fontFamily: 'var(--font-inter), Inter, sans-serif',
                    }}
                    aria-hidden
                  >
                    <span className="text-black font-semibold text-base sm:text-lg">Voir</span>
                  </div>
                )}
                
                {/* Image principale — retry automatique si échec (jusqu'à 3 tentatives) */}
                {showImage ? (
                  <div className="relative mb-8 flex items-center justify-center overflow-visible">
                    <motion.div
                      className="relative"
                      style={{
                        transform: `rotate(${index % 2 === 0 ? -4 : 4}deg)`,
                        transformOrigin: 'center',
                      }}
                      whileHover={{ 
                        scale: 1.05,
                        rotate: index % 2 === 0 ? -2 : 2,
                      }}
                      transition={{ duration: 0.3 }}
                    >
                      <img
                        key={`img-${project.id}-${imageRetryKey[project.id] ?? 0}`}
                        src={
                          mainImage!.url +
                          (imageRetryKey[project.id]
                            ? `${mainImage!.url.includes('?') ? '&' : '?'}retry=${imageRetryKey[project.id]}`
                            : '')
                        }
                        alt={mainImage!.alt || project.title}
                        className="max-w-full h-auto rounded-2xl shadow-2xl"
                        style={{ borderRadius: '16px' }}
                        onError={() => {
                          const retries = imageRetryKey[project.id] ?? 0;
                          if (retries >= MAX_IMAGE_RETRIES) {
                            setFailedImageIds((prev) => new Set(prev).add(project.id));
                            console.warn(
                              '[Projects] Image échouée après',
                              MAX_IMAGE_RETRIES + 1,
                              'tentatives:',
                              mainImage!.url,
                              '| Projet:',
                              project.title,
                              '— Vérifiez que le fichier existe (ex: public/projects/) ou que l’URL Supabase est valide.'
                            );
                            return;
                          }
                          if (retryTimeoutsRef.current[project.id] != null) {
                            clearTimeout(retryTimeoutsRef.current[project.id]);
                          }
                          setFailedImageIds((prev) => new Set(prev).add(project.id));
                          const timeoutId = setTimeout(() => {
                            setFailedImageIds((prev) => {
                              const next = new Set(prev);
                              next.delete(project.id);
                              return next;
                            });
                            setImageRetryKey((prev) => ({
                              ...prev,
                              [project.id]: retries + 1,
                            }));
                            delete retryTimeoutsRef.current[project.id];
                          }, RETRY_DELAY_MS);
                          retryTimeoutsRef.current[project.id] = timeoutId;
                        }}
                      />
                    </motion.div>
                  </div>
                ) : (
                  <div className="relative mb-8 flex items-center justify-center overflow-visible">
                    <motion.div
                      className="relative"
                      style={{
                        transform: `rotate(${index % 2 === 0 ? -4 : 4}deg)`,
                        transformOrigin: 'center',
                      }}
                    >
                      <img
                        src="/placeholder-project.svg"
                        alt={`Image non disponible — ${project.title}`}
                        className="max-w-full h-auto rounded-2xl shadow-2xl w-full min-h-[200px] object-cover"
                        style={{ borderRadius: '16px' }}
                      />
                    </motion.div>
                  </div>
                )}

                {/* Project Info */}
                <div className="text-center relative z-10">
                  <h3 
                    className="text-2xl sm:text-3xl font-normal text-gray-900 mb-2"
                    style={{ fontFamily: 'var(--font-canela-deck)' }}
                  >
                    {project.title}
                  </h3>
                  <p 
                    className="text-sm sm:text-base text-gray-600 mb-4"
                    style={{ fontFamily: 'var(--font-inter), Inter, sans-serif' }}
                  >
                    Web Design and Development
                  </p>
                  
                  {/* CTA Link */}
                  {project.cmsLink && (
                    project.cmsLink.startsWith('http') ? (
                      <a
                        href={project.cmsLink}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium transition-colors group"
                        style={{ fontFamily: 'var(--font-inter), Inter, sans-serif' }}
                      >
                        Voir le projet
                        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                      </a>
                    ) : (
                      <Link
                        href={project.cmsLink}
                        className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium transition-colors group"
                        style={{ fontFamily: 'var(--font-inter), Inter, sans-serif' }}
                      >
                        Voir le projet
                        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                      </Link>
                    )
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
