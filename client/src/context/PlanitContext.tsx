"use client";
import { createContext, useContext, useState } from "react";

export interface Subtask {
  id: string;
  title: string;
  status: "Todo" | "In Progress" | "Done";
}

export interface TaskData {
  id: string;
  title: string;
  subtasks: Subtask[];
  notes: string;
  status: "Todo" | "In Progress" | "Done";
}

interface PlanitContextProps {
  tasks: TaskData[];
  setTasks: React.Dispatch<React.SetStateAction<TaskData[]>>;
}

export const PlanitContext = createContext<PlanitContextProps | undefined>(
  undefined
);

export const PlanitProvider = ({ children }: { children: React.ReactNode }) => {
  const [tasks, setTasks] = useState<TaskData[]>([]);

  return (
    <PlanitContext.Provider value={{ tasks, setTasks }}>
      {children}
    </PlanitContext.Provider>
  );
};

export const usePlanit = () => {
  const context = useContext(PlanitContext);
  if (!context) {
    throw new Error("usePlanit must be used within a PlanitProvider");
  }
  return context;
};
