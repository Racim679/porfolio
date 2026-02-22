'use client';

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';

type TransitionContextValue = {
  pendingRoute: string | null;
  pendingScrollY: number;
  startTransitionTo: (href: string, scrollY?: number) => void;
  clearPendingRoute: () => void;
};

const TransitionContext = createContext<TransitionContextValue | null>(null);

export function useTransition() {
  const ctx = useContext(TransitionContext);
  return ctx;
}

export function TransitionProvider({ children }: { children: ReactNode }) {
  const [pendingRoute, setPendingRoute] = useState<string | null>(null);
  const [pendingScrollY, setPendingScrollY] = useState(0);
  const startTransitionTo = useCallback((href: string, scrollY?: number) => {
    const y = scrollY ?? (typeof window !== 'undefined' ? window.scrollY : 0);
    setPendingScrollY(y);
    setPendingRoute(href);
  }, []);
  const clearPendingRoute = useCallback(() => {
    setPendingRoute(null);
    setPendingScrollY(0);
  }, []);

  return (
    <TransitionContext.Provider
      value={{ pendingRoute, pendingScrollY, startTransitionTo, clearPendingRoute }}
    >
      {children}
    </TransitionContext.Provider>
  );
}
