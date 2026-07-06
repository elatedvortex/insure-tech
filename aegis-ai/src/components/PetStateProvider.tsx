"use client";

import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

const PetStateContext = createContext<{
  isCat: boolean;
  togglePet: () => void;
  setCat: (value: boolean) => void;
} | null>(null);

export function PetStateProvider({ children }: { children: ReactNode }) {
  const [isCat, setIsCat] = useState(false);

  const value = useMemo(
    () => ({
      isCat,
      togglePet: () => setIsCat((current) => !current),
      setCat: (value: boolean) => setIsCat(value),
    }),
    [isCat]
  );

  return <PetStateContext.Provider value={value}>{children}</PetStateContext.Provider>;
}

export function usePetState() {
  const context = useContext(PetStateContext);
  if (!context) {
    throw new Error("usePetState must be used within PetStateProvider");
  }
  return context;
}
