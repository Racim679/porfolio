import { createClient } from '@supabase/supabase-js';

// Types pour la base de données
export interface Project {
  id: string;
  title: string;
  description: string;
  slug: string;
  main_image_url?: string;
  cms_link?: string;
  created_at: string;
  updated_at: string;
  published: boolean;
  order_index: number;
}

export interface ProjectImage {
  id: string;
  project_id: string;
  image_url: string;
  alt_text: string;
  order_index: number;
  created_at: string;
}

export interface ProjectFeedback {
  id: string;
  project_id: string;
  quote: string;
  author: string;
  author_role?: string;
  created_at: string;
}

export interface ProjectMetric {
  id: string;
  project_id: string;
  label: string;
  value: string;
  order_index: number;
  created_at: string;
}

// Type complet avec relations
export interface ProjectWithRelations extends Project {
  project_images: ProjectImage[];
  project_feedback: ProjectFeedback[];
  project_metrics: ProjectMetric[];
}

// Client Supabase pour le navigateur
export const createSupabaseClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables');
  }

  return createClient(supabaseUrl, supabaseAnonKey);
};

// Client Supabase par défaut
export const supabase = createSupabaseClient();

/**
 * Ajoute un paramètre de cache-busting à une URL d'image Supabase Storage
 * Utilise le timestamp updated_at du projet pour forcer le rechargement
 * @param imageUrl - L'URL de l'image (peut être Supabase Storage ou locale)
 * @param updatedAt - Le timestamp updated_at du projet (optionnel)
 * @returns L'URL avec le paramètre de cache-busting si c'est une URL Supabase Storage
 */
export function addCacheBusting(imageUrl: string | undefined | null, updatedAt?: string | null): string | undefined {
  if (!imageUrl || imageUrl.trim() === '') return undefined;
  
  // Si c'est une URL locale (commence par /), on ne modifie pas
  if (imageUrl.startsWith('/')) {
    return imageUrl;
  }
  
  // Si c'est une URL Supabase Storage, on ajoute le cache-busting
  if (imageUrl.includes('supabase.co/storage')) {
    const separator = imageUrl.includes('?') ? '&' : '?';
    // Utilise updated_at si disponible, sinon un timestamp basé sur la date actuelle
    const cacheParam = updatedAt 
      ? `t=${new Date(updatedAt).getTime()}`
      : `t=${Date.now()}`;
    return `${imageUrl}${separator}${cacheParam}`;
  }
  
  // Pour les autres URLs externes, on ajoute aussi le cache-busting
  const separator = imageUrl.includes('?') ? '&' : '?';
  const cacheParam = updatedAt 
    ? `t=${new Date(updatedAt).getTime()}`
    : `t=${Date.now()}`;
  return `${imageUrl}${separator}${cacheParam}`;
}
