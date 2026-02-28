import type { Metadata } from 'next';
import ApplyForm from './ApplyForm';

export const metadata: Metadata = {
  title: 'Réserver mon appel — VSL',
  description: '4 questions rapides pour vérifier ton adéquation avec l\'offre, puis choisis ton créneau.',
  robots: { index: false, follow: false },
};

export default function ApplyPage() {
  return <ApplyForm />;
}
