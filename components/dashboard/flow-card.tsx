"use client";

import { toggleFlow, deleteFlow } from "@/actions/flows";
import { useState } from "react";

type Flow = {
  id: string;
  name: string;
  prompt: string;
  cronExpression: string;
  isActive: boolean | null;
  createdAt: Date | null;
};

export function FlowCard({ flow, onUpdate }: { flow: Flow; onUpdate?: () => void }) {
  const [loading, setLoading] = useState(false);

  async function handleToggle() {
    setLoading(true);
    try {
      await toggleFlow(flow.id, !flow.isActive);
      onUpdate?.();
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    if (!confirm("Delete this flow?")) return;
    setLoading(true);
    try {
      await deleteFlow(flow.id);
      onUpdate?.();
    } finally {
      setLoading(false);
    }
  }

  async function handleRunNow() {
    setLoading(true);
    try {
      const res = await fetch(`/api/flow/${flow.id}/run`, { method: "POST" });
      const data = await res.json();
      if (data.status === "success") {
        alert("Flow executed successfully!");
      } else {
        alert(`Flow failed: ${data.logs?.[data.logs.length - 1]?.error || "Unknown error"}`);
      }
    } catch {
      alert("Failed to run flow");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-zinc-900 rounded-lg p-4 space-y-3">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-medium text-white">{flow.name}</h3>
          <p className="text-sm text-gray-400 mt-1">{flow.prompt}</p>
        </div>
        <span
          className={`px-2 py-1 text-xs rounded-full ${
            flow.isActive
              ? "bg-green-900 text-green-400"
              : "bg-zinc-800 text-gray-400"
          }`}
        >
          {flow.isActive ? "Active" : "Paused"}
        </span>
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-zinc-800">
        <code className="text-xs text-gray-400 bg-zinc-800 px-2 py-1 rounded">
          {flow.cronExpression}
        </code>

        <div className="flex gap-2">
          <button
            onClick={handleRunNow}
            disabled={loading}
            className="text-sm text-blue-400 hover:text-blue-300 disabled:opacity-50"
          >
            Run Now
          </button>
          <button
            onClick={handleToggle}
            disabled={loading}
            className="text-sm text-gray-400 hover:text-white disabled:opacity-50"
          >
            {flow.isActive ? "Pause" : "Resume"}
          </button>
          <button
            onClick={handleDelete}
            disabled={loading}
            className="text-sm text-red-500 hover:text-red-400 disabled:opacity-50"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
