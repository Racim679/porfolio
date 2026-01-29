'use client';

export default function Footer() {
  return (
    <footer id="contact" className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-y-6 sm:gap-y-0">
          <a
            href="mailto:ssracim.dev@gmail.com"
            className="group inline-block text-gray-500 hover:text-sky-400 transition-colors text-sm sm:text-base sm:px-8 lg:px-12"
            aria-label="Email"
          >
            <span className="relative inline-block">
              Mail
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-sky-400 scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300 ease-out" aria-hidden />
            </span>
          </a>
          <a
            href="https://www.linkedin.com/in/racim-si-smail-11680a389/"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-block text-gray-500 hover:text-sky-400 transition-colors text-sm sm:text-base sm:px-8 lg:px-12"
            aria-label="LinkedIn"
          >
            <span className="relative inline-block">
              LinkedIn
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-sky-400 scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300 ease-out" aria-hidden />
            </span>
          </a>
          <a
            href="https://api.whatsapp.com/send/?phone=33765683250&text=Bonjour%2C&type=phone_number&app_absent=0"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-block text-gray-500 hover:text-sky-400 transition-colors text-sm sm:text-base sm:px-8 lg:px-12"
            aria-label="WhatsApp"
          >
            <span className="relative inline-block">
              WhatsApp
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-sky-400 scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300 ease-out" aria-hidden />
            </span>
          </a>
        </div>
      </div>
    </footer>
  );
}
