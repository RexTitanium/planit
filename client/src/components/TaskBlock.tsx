// src/components/TaskBlock.tsx
"use client";
import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import StatusToggleButton from "@/components/StatusToggleButton";
import { Subtask } from "@/context/PlanitContext";

interface TaskBlockProps {
  id: string;
  title: string;
  subtasks?: Subtask[];
  notes?: string;
  status?: "Todo" | "In Progress" | "Done";
  onUpdate?: (
    task: {
      title: string;
      subtasks: Subtask[];
      notes: string;
      status: "Todo" | "In Progress" | "Done";
    }
  ) => void;
}

export default function TaskBlock({
  id: id,
  title: initTitle,
  subtasks: initSubtasks = [],
  notes: initNotes = "",
  onUpdate,
}: TaskBlockProps) {
  const [title, setTitle] = useState(initTitle);
  const [subtasks, setSubtasks] = useState<Subtask[]>(
    initSubtasks.map((s) => ({ ...s, id: s.id || uuidv4() }))
  );
  const [notes, setNotes] = useState(initNotes);
  const [status, setStatus] = useState<"Todo" | "In Progress" | "Done">("Todo");

  useEffect(() => {
    const total = subtasks.length;
    const done = subtasks.filter((s) => s.status === "Done").length;
    const inProgress = subtasks.filter(
      (s) => s.status === "In Progress"
    ).length;

    if (total === 0) setStatus("Todo");
    else if (done === total) setStatus("Done");
    else if (done > 0 || inProgress > 0) setStatus("In Progress");
    else setStatus("Todo");
  }, [subtasks]);

  const handleSubtaskChange = (
    subtaskId: string,
    key: keyof Subtask,
    value: string
  ) => {
    const updated = subtasks.map((sub) =>
      sub.id === subtaskId ? { ...sub, [key]: value } : sub
    );
    setSubtasks(updated);
  };

  const addSubtask = () => {
    setSubtasks([...subtasks, { id: uuidv4(), title: "", status: "Todo" }]);
  };

  const removeSubtask = (subtaskId: string) => {
    setSubtasks(subtasks.filter((sub) => sub.id !== subtaskId));
  };

  const emitUpdate = () => {
    onUpdate?.({ title, subtasks, notes, status });
  };

  return (
    <div className="grid grid-cols-1 items-start gap-4 w-full border-b border-gray-800 py-3">
      <div>
        <div className="flex flex-row gap-2">
          <StatusToggleButton
            value={status}
            onChange={(newStatus) => {
              handleSubtaskChange(id, "status", newStatus);
              emitUpdate();
            }}
          />
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={emitUpdate}
            className={`bg-transparent text-sm outline-none w-full placeholder:text-gray-600 ${
              status === "Done" ? "line-through text-gray-500" : "text-gray-300"
            }`}
            placeholder="Task title"
          />
        </div>
        <ul className="w-full ml-4 mt-2 space-y-1">
          {subtasks.map((subtask) => (
            <li
              key={subtask.id}
              className="flex justify-between items-between gap-2"
            >
              <button
                onClick={() => removeSubtask(subtask.id)}
                className="w-6 h-6 bg-red-500 transition-all duration-300 ease flex flex-row justify-center items-center rounded-xl hover:bg-red-600 cursor-pointer"
              >
                -
              </button>
              <StatusToggleButton
                value={subtask.status}
                onChange={(newStatus) => {
                  handleSubtaskChange(subtask.id, "status", newStatus);
                  emitUpdate();
                }}
              />
              <textarea
                value={subtask.title}
                onChange={(e) =>
                  handleSubtaskChange(subtask.id, "title", e.target.value)
                }
                onBlur={emitUpdate}
                className={`bg-transparent text-sm resize-none outline-none w-full placeholder:text-gray-600 ${
                  subtask.status === "Done"
                    ? "line-through text-gray-500"
                    : "text-gray-300"
                }`}
                placeholder="Subtask"
              />
            </li>
          ))}
          <button
            onClick={addSubtask}
            className="text-md text-white/40 mt-1 w-6 h-6 bg-zinc-800 rounded-xl cursor-pointer"
          >
            +
          </button>
        </ul>
      </div>

      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        onBlur={emitUpdate}
        placeholder="Notes..."
        className="w-full bg-transparent text-gray-400 text-xs resize-none outline-none min-h-[48px] placeholder:text-gray-600"
      />
    </div>
  );
}
