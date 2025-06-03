"use client";
import { useRouter } from "next/navigation";
import { usePlanit } from "@/context/PlanitContext"; // import context
import { useState } from "react";

export default function Home() {
  const [goal, setGoal] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { setTasks } = usePlanit();

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const handleGenerateDraft = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/generate-tasks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ goal }),
      });

      const data = await res.json();
      setTasks(data.tasks); // 💡 Save in context
      router.push("/taskboard"); // 🧠 Just go to the route now
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 sm:p-20 gap-8 font-[family-name:var(--font-geist-sans)] bg-[#0a0a0a] text-white">
      <div className="text-2xl font-bold">Welcome to Planit</div>

      <div className="w-[90vw] max-w-[600px] bg-[#1c1c1c] p-4 rounded-xl flex flex-col gap-4 shadow-lg">
        <textarea
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
          placeholder="What's your goal today?"
          className="w-full h-32 resize-none bg-transparent outline-none text-white text-base placeholder:text-gray-500"
        />

        <div className="flex justify-end gap-2">
          <button
            onClick={() => setGoal("")}
            disabled={loading}
            className="px-4 py-2 rounded-lg text-sm bg-transparent text-gray-400 hover:text-white hover:bg-gray-700 transition disabled:opacity-50"
          >
            Clear
          </button>
          <button
            onClick={handleGenerateDraft}
            disabled={loading}
            className="px-4 py-2 rounded-lg text-sm bg-[#4f46e5] text-white hover:bg-[#4338ca] transition disabled:opacity-50"
          >
            {loading ? "Generating..." : "Generate Draft"}
          </button>
        </div>
      </div>

      {loading && (
        <div className="text-sm text-gray-400 mt-2">
          Drafting your task board...
        </div>
      )}
    </div>
  );
}
