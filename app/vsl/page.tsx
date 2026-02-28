import type { Metadata } from 'next';
import VslClient from './VslClient';

export const metadata: Metadata = {
  title: 'Système Client Automatisé — Freelances & Indépendants',
  description:
    'Un système tout-en-un qui capte, qualifie et convertit tes prospects automatiquement. Fini la prospection manuelle.',
  robots: { index: false, follow: false },
};

export default function VslPage() {
  return <VslClient />;
}
