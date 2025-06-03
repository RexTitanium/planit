"use client";
import { motion } from "framer-motion";
import { Check, Minus } from "lucide-react";

interface StatusToggleButtonProps {
  value: "Todo" | "In Progress" | "Done";
  onChange: (newStatus: "Todo" | "In Progress" | "Done") => void;
}

export default function StatusToggleButton({
  value,
  onChange,
}: StatusToggleButtonProps) {
  const handleClick = () => {
    const next =
      value === "Todo"
        ? "In Progress"
        : value === "In Progress"
        ? "Done"
        : "Todo";
    onChange(next);
  };

  const baseStyle =
    "w-6 h-6 rounded-[6px] flex items-center justify-center transition-all duration-200 cursor-pointer";

  const variants = {
    Todo: "border-2 border-zinc-800 bg-transparent text-transparent",
    "In Progress": "border-2 border-zinc-800 bg-zinc-800 text-white",
    Done: "border-2  border-zinc-800 bg-zinc-800 text-white",
  };

  const icon = {
    Todo: null,
    "In Progress": <Minus className="w-3 h-3" />,
    Done: <Check className="w-3 h-3" />,
  };

  return (
    <motion.button
      whileTap={{ scale: 0.9 }}
      onClick={handleClick}
      className={`${baseStyle} ${variants[value]}`}
      title={`Status: ${value} (click to cycle)`}
    >
      {icon[value]}
    </motion.button>
  );
}
