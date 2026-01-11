"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createFlow } from "@/actions/flows";

// TODO: Replace with actual user ID from auth
const TEMP_USER_ID = "00000000-0000-0000-0000-000000000000";

export function FlowForm() {
  const router = useRouter();
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!prompt.trim()) return;

    setLoading(true);
    setError(null);

    try {
      await createFlow(TEMP_USER_ID, prompt);
      setPrompt("");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create flow");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="prompt" className="block text-sm font-medium text-gray-400 mb-2">
          Describe your automation
        </label>
        <textarea
          id="prompt"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="e.g., Send me Bitcoin price on Telegram every morning at 9am"
          className="w-full px-4 py-3 bg-zinc-800 rounded-lg focus:outline-none text-white placeholder-gray-500 resize-none"
          rows={3}
          disabled={loading}
        />
      </div>

      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}

      <button
        type="submit"
        disabled={loading || !prompt.trim()}
        className="w-full px-4 py-2 bg-zinc-600 text-white rounded-lg font-medium hover:bg-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {loading ? "Creating..." : "Create Flow"}
      </button>
    </form>
  );
}