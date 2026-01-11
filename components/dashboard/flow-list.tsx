"use client";

import { useRouter } from "next/navigation";
import { FlowCard } from "./flow-card";

type Flow = {
  id: string;
  name: string;
  prompt: string;
  cronExpression: string;
  isActive: boolean | null;
  createdAt: Date | null;
};

export function FlowList({ initialFlows }: { initialFlows: Flow[] }) {
  const router = useRouter();

  function handleUpdate() {
    router.refresh();
  }

  if (initialFlows.length === 0) {
    return (
      <div className="text-center py-12 bg-zinc-900 rounded-lg">
        <p className="text-gray-400">Create your first flow above.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {initialFlows.map((flow) => (
        <FlowCard key={flow.id} flow={flow} onUpdate={handleUpdate} />
      ))}
    </div>
  );
}
