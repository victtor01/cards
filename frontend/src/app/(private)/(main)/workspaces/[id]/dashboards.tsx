import DashboardCard from "@/components/workspaces";
import { GenerateSoundClick } from "@/utils/generate-sound-click";
import { useRouter } from "next/navigation";
import { GoPlus } from "react-icons/go";
import { useDashboards } from "./hooks";
import { IWorkspace } from "@/interfaces/IWorkspace";

type DashBoardProps = {
  workspace: IWorkspace;
};

export const Dashboards = ({ workspace }: DashBoardProps) => {
  const workspaceLength = workspace?.workspaces?.length || 0;
  const cardsLength = workspace?.cards?.length || 0;

  return (
    <section className="flex">
      <div className="w-full flex justify-between items-center gap-6 max-w-main mx-auto">
        <DashboardCard.Container title="Amount of documents">
          <div className="text-lg mt-2 font-semibold">
            <span className="text-violet-500">{workspaceLength || 0}</span>{" "}
            Workspaces
          </div>
          <div className="text-lg mt-1 font-semibold">
            <span className="text-violet-500">{cardsLength || 0}</span> Cards
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
