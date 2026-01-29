import type { Metadata } from "next";
import { Inter } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

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
  title: "Portfolio",
  description: "Portfolio professionnel",
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
        {children}
      </body>
    </html>
  );
}
