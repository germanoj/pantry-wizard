import React, { createContext, useContext, useMemo, useState } from "react";

type SplashContextValue = {
  splashDone: boolean;
  setSplashDone: (v: boolean) => void;
};

const SplashContext = createContext<SplashContextValue | null>(null);

export function SplashProvider({ children }: { children: React.ReactNode }) {
  const [splashDone, setSplashDone] = useState(false);

  const value = useMemo(() => ({ splashDone, setSplashDone }), [splashDone]);
  return <SplashContext.Provider value={value}>{children}</SplashContext.Provider>;
}

export function useSplash() {
  const ctx = useContext(SplashContext);
  if (!ctx) throw new Error("useSplash must be used within SplashProvider");
  return ctx;
}
