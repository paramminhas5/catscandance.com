"use client";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

type DiscoCtx = { disco: boolean; toggle: () => void; beat: number };
const Ctx = createContext<DiscoCtx>({ disco: false, toggle: () => {}, beat: 0 });

export function DiscoProvider({ children }: { children: ReactNode }) {
  const [disco, setDisco] = useState(false);
  const [beat, setBeat] = useState(0);

  useEffect(() => {
    if (!disco) return;
    document.body.classList.add("disco");
    const id = setInterval(() => setBeat((b) => b + 1), 500);
    return () => {
      clearInterval(id);
      document.body.classList.remove("disco");
    };
  }, [disco]);

  return (
    <Ctx.Provider value={{ disco, toggle: () => setDisco((v) => !v), beat }}>
      {children}
    </Ctx.Provider>
  );
}

export const useDisco = () => useContext(Ctx);
