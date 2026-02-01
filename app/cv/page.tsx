'use client';

import Link from 'next/link';
import CvDownloadButton from '@/components/CvDownloadButton';
import { useState, useEffect } from 'react';

const CV_PDF = '/cv%20(7).pdf';

export default function CvPage() {
  const [isMobileOrIOS, setIsMobileOrIOS] = useState(false);

  useEffect(() => {
    const ua = typeof navigator !== 'undefined' ? navigator.userAgent : '';
    const isIOS = /iPad|iPhone|iPod/.test(ua);
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua) || (typeof window !== 'undefined' && window.innerWidth < 768);
    setIsMobileOrIOS(isIOS || isMobile);
  }, []);

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
        <CvDownloadButton />
      </div>
      <div className="w-full min-h-[calc(100vh-60px)]">
        {isMobileOrIOS ? (
          <div className="flex flex-col items-center justify-center min-h-[calc(100vh-60px)] px-6 py-12 text-center">
            <p className="text-gray-600 mb-6 max-w-sm" style={{ fontFamily: 'var(--font-inter), Inter, sans-serif' }}>
              Sur mobile, ouvrez le CV pour le consulter. Vous pourrez le télécharger depuis l&apos;aperçu (icône partage).
            </p>
            <a
              href={CV_PDF}
              target="_blank"
              rel="noopener noreferrer"
              className="cursor-cta inline-flex items-center gap-2 px-6 py-3 text-base font-medium text-white bg-blue-600 rounded-full hover:bg-blue-700 transition-colors"
              style={{ fontFamily: 'var(--font-inter), Inter, sans-serif' }}
            >
              Ouvrir le CV
            </a>
          </div>
        ) : (
          <iframe
            src={`${CV_PDF}#view=FitH`}
            title="CV Racim Si Smail"
            className="w-full h-[calc(100vh-60px)] border-0"
          />
        )}
      </div>
    </div>
  );
}
