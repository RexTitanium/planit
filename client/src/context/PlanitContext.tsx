"use client";
import { createContext, useContext, useState } from "react";

export const PlanitContext = createContext<any>(null);

export const PlanitProvider = ({ children }: { children: React.ReactNode }) => {
  const [tasks, setTasks] = useState<string[]>([]);

  return (
    <PlanitContext.Provider value={{ tasks, setTasks }}>
      {children}
    </PlanitContext.Provider>
  );
};

export const usePlanit = () => useContext(PlanitContext);
