import DashboardCard from "@/components/workspaces";
import { IWorkspace } from "@/interfaces/IWorkspace";
import { useRouter } from "next/navigation";
import { BsArrowRight } from "react-icons/bs";
import { useDashboards } from "./hooks";

type DashBoardProps = {
  workspace: IWorkspace;
};

export const Dashboards = ({ workspace }: DashBoardProps) => {
  const { latestCard } = useDashboards();
  const workspaceLength = workspace?.workspaces?.length || 0;
  const cardsLength = workspace?.cards?.length || 0;
  const router = useRouter();

  return (
    <div className="w-full flex justify-between items-center gap-6 max-w-main mx-auto">
      <DashboardCard.Container title="Total de documentos">
        <div className="text-lg mt-2 font-semibold flex">
          <span className="text-violet-500 w-5">{workspaceLength || 0}</span>{" "}
          Espaços
        </div>
        <div className="text-lg mt-1 font-semibold flex">
          <span className="text-violet-500 w-5">{cardsLength || 0}</span> Arquivos
        </div>
      </DashboardCard.Container>

      <DashboardCard.Container title="Continue de onde você parou">
        <div className="text-lg mt-2">
          {!latestCard?.id && <span className="text-zinc-500"></span>}
          
          {latestCard?.id && (
            <div className="flex dark:bg-zinc-900 rounded justify-between items-center">
              <div className="flex gap-2 items-center">
                <span className="font-semibold text-zinc-500 px-3 text-base p-1 bg-zinc-200 dark:bg-zinc-800 rounded">
                  {latestCard?.title}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => router.push(`/card/${latestCard.id}`)}
                  className="bg-indigo-600 text-white p-1 px-3 rounded opacity-90 hover:opacity-100"
                >
                  <BsArrowRight size={18} />
                </button>
              </div>
            </div>
          )}
        </div>
      </DashboardCard.Container>

      <DashboardCard.Container title="Ações recentes">
        <div className="text-lg mt-2 text-zinc-300">
          <span className="text-zinc-500">No recents actions...</span>
        </div>
      </DashboardCard.Container>
    </div>
  );
};
