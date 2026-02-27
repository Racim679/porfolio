import type { Metadata } from "next";
import { Inter } from "next/font/google";
import localFont from "next/font/local";
import "lenis/dist/lenis.css";
import "./globals.css";
import LenisProvider from "@/components/LenisProvider";
import IntroOverlay from "@/components/IntroOverlay";
import { TransitionProvider } from "@/components/TransitionContext";
import PageTransition from "@/components/PageTransition";
import { Analytics } from "@vercel/analytics/next";

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

const baseUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

const logoUrl = `${baseUrl.replace(/\/$/, "")}/logo.png`;

const webPageJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Racim Si Smail – Developpeur | Etudiant",
  description: "Entrepreneur, Développeur, Brand designer. Solutions digitales fluides.",
  url: baseUrl,
  image: logoUrl,
  primaryImageOfPage: logoUrl,
};

const canonicalUrl = baseUrl.replace(/\/$/, "") + "/";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  alternates: {
    canonical: canonicalUrl,
  },
  title: "Racim Si Smail – Developpeur | Etudiant",
  description: "Entrepreneur, Développeur, Brand designer | J'aide les entreprises à développer leur activité et à optimiser leurs processus en créant des solutions digitales fluides.",
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
  openGraph: {
    title: "Racim Si Smail – Developpeur | Etudiant",
    description: "Entrepreneur, Développeur, Brand designer | J'aide les entreprises à développer leur activité et à optimiser leurs processus en créant des solutions digitales fluides.",
    type: "website",
    images: [{ url: "/logo.png", width: 1200, height: 630, alt: "Racim Si Smail - Portfolio" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Racim Si Smail – Developpeur | Etudiant",
    description: "Entrepreneur, Développeur, Brand designer | J'aide les entreprises à développer leur activité et à optimiser leurs processus en créant des solutions digitales fluides.",
    images: [{ url: "/logo.png", width: 1200, height: 630, alt: "Racim Si Smail - Portfolio" }],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageJsonLd) }}
        />
      </head>
      <body
        className={`${inter.variable} ${canelaDeck.variable} antialiased`}
        style={{ margin: 0, backgroundColor: "#2563eb" }}
      >
        <LenisProvider>
          <IntroOverlay />
          <TransitionProvider>
            <PageTransition>{children}</PageTransition>
          </TransitionProvider>
        </LenisProvider>
        <Analytics />
      </body>
    </html>
  );
}
