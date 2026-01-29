'use client';

export default function Footer() {
  return (
    <footer id="contact" className="py-12 bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-y-6 sm:gap-y-0">
          <a
            href="mailto:contact@example.com"
            className="text-gray-500 hover:text-gray-700 transition-colors text-sm sm:text-base sm:px-8 lg:px-12"
            aria-label="Email"
          >
            Mail
          </a>
          <a
            href="https://linkedin.com/in/yourprofile"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-500 hover:text-gray-700 transition-colors text-sm sm:text-base sm:px-8 lg:px-12"
            aria-label="LinkedIn"
          >
            LinkedIn
          </a>
          <a
            href="https://wa.me/yournumber"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-500 hover:text-gray-700 transition-colors text-sm sm:text-base sm:px-8 lg:px-12"
            aria-label="WhatsApp"
          >
            WhatsApp
          </a>
        </div>
      </div>
    </footer>
  );
}
