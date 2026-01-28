'use client';

import { Mail, Linkedin, MessageCircle } from 'lucide-react';

export default function Footer() {
  return (
    <footer id="contact" className="py-12 bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-8">
          {/* Mail */}
          <a
            href="mailto:contact@example.com"
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors text-sm sm:text-base"
            aria-label="Email"
          >
            <Mail className="w-5 h-5" />
            <span>Mail</span>
          </a>

          {/* LinkedIn */}
          <a
            href="https://linkedin.com/in/yourprofile"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors text-sm sm:text-base"
            aria-label="LinkedIn"
          >
            <Linkedin className="w-5 h-5" />
            <span>LinkedIn</span>
          </a>

          {/* WhatsApp+ */}
          <a
            href="https://wa.me/yournumber"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors text-sm sm:text-base"
            aria-label="WhatsApp"
          >
            <MessageCircle className="w-5 h-5" />
            <span>WhatsApp+</span>
          </a>
        </div>
      </div>
    </footer>
  );
}
