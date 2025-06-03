// src/app/board/[id]/page.tsx
"use client";

import { useState } from "react";

interface TaskData {
  title: string;
  subtasks: string[];
  notes?: string;
  status: "Todo" | "In Progress" | "Done";
  completed?: boolean;
}

export default function BoardPage() {
  const [tasks, setTasks] = useState<TaskData[]>([
    {
      title: "Design backend system",
      subtasks: ["Define API routes", "Plan DB schema"],
      notes: "High priority - design scalable endpoints",
      status: "In Progress",
      completed: false,
    },
  ]);

  const toggleSubtask = (taskIndex: number, subIndex: number) => {
    const updated = [...tasks];
    const subtasks = updated[taskIndex].subtasks;
    const value = subtasks[subIndex];
    if (value.startsWith("[x] ")) {
      subtasks[subIndex] = value.replace("[x] ", "[ ] ");
    } else if (value.startsWith("[ ] ")) {
      subtasks[subIndex] = value.replace("[ ] ", "[x] ");
    } else {
      subtasks[subIndex] = "[x] " + value;
    }
    setTasks(updated);
  };

  return (
    <main className="min-h-screen bg-[#0e0e0e] text-white px-6 py-10 font-sans">
      <h1 className="text-3xl font-semibold mb-8">📋 Project Board</h1>

      <div className="flex flex-col space-y-2">
        <div className="grid grid-cols-[24px_1fr_150px_100px] gap-4 text-sm text-gray-400 border-b border-gray-800 pb-2">
          <span></span>
          <span>Task</span>
          <span>Status</span>
          <span>Notes</span>
        </div>

        {tasks.map((task, i) => (
          <div
            key={i}
            className="grid grid-cols-[24px_1fr_150px_100px] gap-4 items-start py-2 border-b border-gray-900"
          >
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => {
                const updated = [...tasks];
                updated[i].completed = !updated[i].completed;
                setTasks(updated);
              }}
              className="accent-blue-500"
            />
            <div>
              <input
                value={task.title}
                onChange={(e) => {
                  const updated = [...tasks];
                  updated[i].title = e.target.value;
                  setTasks(updated);
                }}
                className="bg-transparent w-full outline-none text-white placeholder:text-gray-500"
              />
              <ul className="ml-4 mt-1 space-y-1">
                {task.subtasks.map((st, j) => (
                  <li
                    key={j}
                    className="text-sm text-gray-300 cursor-pointer hover:text-white"
                    onClick={() => toggleSubtask(i, j)}
                  >
                    {st.startsWith("[x]") ? "✅ " : "⬜ "}
                    {st.replace(/\[.\] /, "")}
                  </li>
                ))}
              </ul>
            </div>
            <select
              value={task.status}
              onChange={(e) => {
                const updated = [...tasks];
                updated[i].status = e.target.value as TaskData["status"];
                setTasks(updated);
              }}
              className="bg-[#1a1a1a] text-white px-2 py-1 rounded text-sm"
            >
              <option value="Todo">Todo</option>
              <option value="In Progress">In Progress</option>
              <option value="Done">Done</option>
            </select>
            <textarea
              value={task.notes || ""}
              onChange={(e) => {
                const updated = [...tasks];
                updated[i].notes = e.target.value;
                setTasks(updated);
              }}
              className="bg-transparent text-sm text-gray-400 resize-none w-full outline-none"
              rows={2}
              placeholder="Optional..."
            />
          </div>
        ))}

        <button
          onClick={() =>
            setTasks((prev) => [
              ...prev,
              { title: "New task", subtasks: [], notes: "", status: "Todo" },
            ])
          }
          className="text-gray-400 hover:text-white mt-4 text-sm"
        >
          + New Task
        </button>
      </div>
    </main>
  );
}
