'use client';

const CV_PDF_URL = '/cv%20.pdf';
const CV_DOWNLOAD_NAME = 'Cv-Si-Smail-Racim.pdf';

export default function CvDownloadButton() {
  const handleDownload = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(CV_PDF_URL);
      if (!res.ok) throw new Error('Erreur chargement PDF');
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = CV_DOWNLOAD_NAME;
      a.style.display = 'none';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch {
      // Fallback: ouvrir dans un nouvel onglet
      window.open(CV_PDF_URL, '_blank');
    }
  };

  return (
    <button
      type="button"
      onClick={handleDownload}
      className="cursor-cta inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-full hover:bg-blue-700 transition-colors"
      style={{ fontFamily: 'var(--font-inter), Inter, sans-serif' }}
    >
      Télécharger le CV
    </button>
  );
}
