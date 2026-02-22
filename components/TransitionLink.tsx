'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLenis } from 'lenis/react';
import { useTransition } from './TransitionContext';
import type { ComponentProps } from 'react';

type TransitionLinkProps = Omit<ComponentProps<typeof Link>, 'href'> & {
  href: string;
};

/**
 * Lien interne qui déclenche la transition (phase 1 sur la page actuelle, puis navigation, puis phase 2 sur la cible).
 * Utilise la position de scroll Lenis pour ne pas sauter en haut.
 */
export default function TransitionLink({ href, onClick, ...rest }: TransitionLinkProps) {
  const pathname = usePathname();
  const lenis = useLenis();
  const ctx = useTransition();
  const startTransitionTo = ctx?.startTransitionTo;

  const isInternal = href.startsWith('/') && !href.startsWith('//');

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e);
    if (e.defaultPrevented) return;
    if (isInternal && href !== pathname && startTransitionTo) {
      e.preventDefault();
      const scrollY = lenis != null ? lenis.scroll : (typeof window !== 'undefined' ? window.scrollY : 0);
      startTransitionTo(href, scrollY);
    }
  };

  return <Link href={href} onClick={handleClick} {...rest} />;
}
