import type { Metadata } from "next";
import { Inter } from "next/font/google";
import localFont from "next/font/local";
import "lenis/dist/lenis.css";
import "./globals.css";
import LenisProvider from "@/components/LenisProvider";
import IntroOverlay from "@/components/IntroOverlay";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const canelaDeck = localFont({
  src: [
    {
      path: '../public/fonts/CanelaDeck-Regular.otf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../public/fonts/CanelaDeck-Bold.otf',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: "--font-canela-deck",
  fallback: ['serif'],
});

export const metadata: Metadata = {
  title: "Racim Si Smail – Developpeur | Etudiant",
  description: "Entrepreneur, Développeur, Brand designer | J'aide les entreprises à développer leur activité et à optimiser leurs processus en créant des solutions digitales fluides.",
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body
        className={`${inter.variable} ${canelaDeck.variable} antialiased`}
      >
        <LenisProvider>
          <IntroOverlay />
          {children}
        </LenisProvider>
      </body>
    </html>
  );
}
