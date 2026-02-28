import type { ReactNode } from 'react';
import { Bebas_Neue, Instrument_Serif, DM_Sans } from 'next/font/google';

const bebasNeue = Bebas_Neue({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-bebas-neue',
  display: 'swap',
});

const instrumentSerif = Instrument_Serif({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-instrument-serif',
  display: 'swap',
});

const dmSans = DM_Sans({
  weight: ['300', '400', '500', '600'],
  subsets: ['latin'],
  variable: '--font-dm-sans',
  display: 'swap',
});

export default function VslLayout({ children }: { children: ReactNode }) {
  return (
    <div className={`${bebasNeue.variable} ${instrumentSerif.variable} ${dmSans.variable}`}>
      {children}
    </div>
  );
}
