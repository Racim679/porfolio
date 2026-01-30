import Link from 'next/link';

const CV_PDF = '/cv%20(7).pdf';
const CV_DOWNLOAD_NAME = 'Cv-Si-Smail-Racim.pdf';

export default function CvPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="sticky top-0 z-10 flex items-center justify-between gap-4 px-4 py-4 bg-white/95 backdrop-blur-sm border-b border-gray-100">
        <Link
          href="/"
          className="text-sm font-medium text-blue-600 hover:underline"
          style={{ fontFamily: 'var(--font-inter), Inter, sans-serif' }}
        >
          ← Retour à l&apos;accueil
        </Link>
        <a
          href={CV_PDF}
          download={CV_DOWNLOAD_NAME}
          className="cursor-cta inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-full hover:bg-blue-700 transition-colors"
          style={{ fontFamily: 'var(--font-inter), Inter, sans-serif' }}
        >
          Télécharger le CV
        </a>
      </div>
      <div className="w-full min-h-[calc(100vh-60px)]">
        <iframe
          src={`${CV_PDF}#view=FitH`}
          title="CV Racim Si Smail"
          className="w-full h-[calc(100vh-60px)] border-0"
        />
      </div>
    </div>
  );
}
