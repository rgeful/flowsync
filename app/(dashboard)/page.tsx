import { getFlows } from "@/actions/flows";
import { FlowForm } from "@/components/dashboard/flow-form";
import { FlowList } from "@/components/dashboard/flow-list";

// Replace with actual user ID from auth later
const TEMP_USER_ID = "00000000-0000-0000-0000-000000000000";

export default async function DashboardPage() {
  const flows = await getFlows(TEMP_USER_ID);

  return (
    <div className="space-y-8">
      <section className="bg-zinc-900 rounded-lg p-6">
        <h2 className="text-lg font-semibold text-white mb-4">
          Create New Flow
        </h2>
        <FlowForm />
      </section>

      <section>
        <h2 className="text-lg font-semibold text-white mb-4">
          Your Flows ({flows.length})
        </h2>
        <FlowList initialFlows={flows} />
      </section>
    </div>
  );
}
