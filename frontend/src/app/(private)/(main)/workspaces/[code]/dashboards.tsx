import DashboardCard from "@/components/workspaces";
import { GenerateSoundClick } from "@/utils/generate-sound-click";
import { useRouter } from "next/navigation";
import { GoPlus } from "react-icons/go";
import { useDashboards } from "./hooks";

export const Dashboards = () => {
  const { redirectToCreate } = useDashboards();

  return (
    <section className="flex m-4">
      <div className="w-full flex justify-between items-center gap-6 max-w-main mx-auto">
        <DashboardCard.Container title="Amount of documents">
          <div className="text-lg mt-2 font-semibold text-zinc-300">
            <span className="text-violet-500">34</span> Documents
          </div>
          <div className="w-full mt-4">
            <button
            onClick={() => redirectToCreate()}
            className="p-2 bg-gradient-to-r from-indigo-600 to-violet-600 rounded px-4 text-sm opacity-70 hover:opacity-100 flex items-center gap-2">
              <GoPlus size={20} />
              Create
            </button>
          </div>
        </DashboardCard.Container>

        <DashboardCard.Container title="Continue where you left off">
          <div className="text-lg mt-2 text-zinc-300">
            <span className="text-zinc-500">No recents actions...</span>
          </div>
        </DashboardCard.Container>

        <DashboardCard.Container title="Recent actions">
          <div className="text-lg mt-2 text-zinc-300">
            <span className="text-zinc-500">No recents actions...</span>
          </div>
        </DashboardCard.Container>
      </div>
    </section>
  );
};
