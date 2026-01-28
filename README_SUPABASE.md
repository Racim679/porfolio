# 🚀 Guide de Configuration Supabase

Ce guide vous explique comment connecter votre portfolio à Supabase et configurer la base de données pour les pages CMS.

## 📦 Étape 1 : Installation

Le package `@supabase/supabase-js` est déjà installé. Si ce n'est pas le cas :

```bash
npm install @supabase/supabase-js
```

## 🔑 Étape 2 : Configuration des Variables d'Environnement

1. **Créez un fichier `.env.local`** à la racine du projet `portfolio/`

2. **Copiez le contenu de `.env.local.example`** et remplissez avec vos vraies valeurs :

```env
NEXT_PUBLIC_SUPABASE_URL=https://votre-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre-anon-key-ici
```

### Où trouver ces valeurs ?

1. Allez sur https://app.supabase.com
2. Sélectionnez votre projet
3. Allez dans **Settings** > **API**
4. Vous trouverez :
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## 🗄️ Étape 3 : Création de la Base de Données

1. Dans votre dashboard Supabase, allez dans **SQL Editor**
2. Cliquez sur **New query**
3. **Copiez tout le contenu** du fichier `supabase/schema.sql`
4. **Collez-le** dans l'éditeur SQL
5. Cliquez sur **Run** (ou appuyez sur `Ctrl+Enter`)

✅ Cela créera toutes les tables nécessaires :
- `projects` - Informations principales des projets
- `project_images` - Images multiples pour chaque projet
- `project_feedback` - Retours/témoignages
- `project_metrics` - Métriques/chiffres clés

## 📸 Étape 4 : Configuration du Storage (Images)

Suivez les instructions dans `supabase/storage-setup.md` pour :
- Créer le bucket `project-images`
- Configurer les politiques de sécurité
- Uploader vos images

## 🔧 Étape 5 : Utilisation dans le Code

### Exemple : Récupérer tous les projets

```typescript
import { supabase } from '@/lib/supabase';
import { Project, ProjectImage, ProjectFeedback, ProjectMetric } from '@/lib/supabase';

async function getProjects() {
  const { data: projects, error } = await supabase
    .from('projects')
    .select(`
      *,
      project_images (*),
      project_feedback (*),
      project_metrics (*)
    `)
    .eq('published', true)
    .order('order_index', { ascending: true });

  if (error) {
    console.error('Error fetching projects:', error);
    return [];
  }

  return projects;
}
```

### Exemple : Récupérer un projet par slug

```typescript
async function getProjectBySlug(slug: string) {
  const { data: project, error } = await supabase
    .from('projects')
    .select(`
      *,
      project_images (*),
      project_feedback (*),
      project_metrics (*)
    `)
    .eq('slug', slug)
    .eq('published', true)
    .single();

  if (error) {
    console.error('Error fetching project:', error);
    return null;
  }

  return project;
}
```

## 📝 Structure des Données

### Table `projects`
```typescript
{
  id: string (UUID)
  title: string
  description: string
  slug: string (unique)
  main_image_url?: string
  cms_link?: string
  published: boolean
  order_index: number
  created_at: string
  updated_at: string
}
```

### Table `project_images`
```typescript
{
  id: string (UUID)
  project_id: string (UUID, référence à projects)
  image_url: string
  alt_text: string
  order_index: number
  created_at: string
}
```

### Table `project_feedback`
```typescript
{
  id: string (UUID)
  project_id: string (UUID, référence à projects)
  quote: string
  author: string
  author_role?: string
  created_at: string
}
```

### Table `project_metrics`
```typescript
{
  id: string (UUID)
  project_id: string (UUID, référence à projects)
  label: string
  value: string
  order_index: number
  created_at: string
}
```

## 🔒 Sécurité (RLS)

Les politiques Row Level Security (RLS) sont déjà configurées :
- ✅ **Lecture publique** : Tout le monde peut voir les projets publiés
- 🔒 **Écriture** : Seulement les utilisateurs authentifiés (à configurer selon vos besoins)

## 🚀 Prochaines Étapes

1. ✅ Exécutez le schéma SQL
2. ✅ Configurez le Storage
3. ✅ Ajoutez vos projets dans la base de données
4. ✅ Modifiez `components/Projects.tsx` pour utiliser les données Supabase

## 💡 Astuces

- Utilisez le **Table Editor** de Supabase pour ajouter/modifier des projets facilement
- Les images doivent être uploadées dans le bucket `project-images`
- Le champ `slug` doit être unique et URL-friendly (ex: `gr-dental-clinic`)
- Utilisez `order_index` pour contrôler l'ordre d'affichage des projets

## 🆘 Dépannage

### Erreur : "Missing Supabase environment variables"
→ Vérifiez que `.env.local` existe et contient les bonnes variables

### Erreur : "relation does not exist"
→ Vérifiez que vous avez bien exécuté le schéma SQL

### Les images ne s'affichent pas
→ Vérifiez que le bucket est public et que les URLs sont correctes
