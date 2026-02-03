'use client';

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';

type TransitionContextValue = {
  pendingRoute: string | null;
  startTransitionTo: (href: string) => void;
  clearPendingRoute: () => void;
};

const TransitionContext = createContext<TransitionContextValue | null>(null);

export function useTransition() {
  const ctx = useContext(TransitionContext);
  return ctx;
}

export function TransitionProvider({ children }: { children: ReactNode }) {
  const [pendingRoute, setPendingRoute] = useState<string | null>(null);
  const startTransitionTo = useCallback((href: string) => {
    setPendingRoute(href);
  }, []);
  const clearPendingRoute = useCallback(() => {
    setPendingRoute(null);
  }, []);

  return (
    <TransitionContext.Provider
      value={{ pendingRoute, startTransitionTo, clearPendingRoute }}
    >
      {children}
    </TransitionContext.Provider>
  );
}
