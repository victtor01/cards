import DashboardCard from "@/components/workspaces";
import { fontSaira } from "@/fonts";
import { IWorkspace } from "@/interfaces/IWorkspace";
import { useRouter } from "next/navigation";
import { BsArrowRight } from "react-icons/bs";
import { FaSquarePollVertical } from "react-icons/fa6";
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
    <div className="flex flex-col gap-4 w-full max-w-main mx-auto">
      <header className="justify-between flex w-full items-center gap-4 rounded-lg">
        <div className="flex gap-3 items-center cursor-default text-gray-500 font-semibold">
          <FaSquarePollVertical />
          <span className={fontSaira}>Dashboard</span>
        </div>
      </header>

      <div className="w-full flex justify-between gap-6 mx-auto lg:flex-row flex-col">
        <DashboardCard.Container title="Total de documentos">
          <div className="text-lg mt-2 font-semibold flex">
            <span className="text-violet-500 w-5">{workspaceLength || 0}</span>{" "}
            Espaços
          </div>
          <div className="text-lg mt-1 font-semibold flex">
            <span className="text-violet-500 w-5">{cardsLength || 0}</span>{" "}
            Arquivos
          </div>
        </DashboardCard.Container>

        <DashboardCard.Container title="Continue de onde você parou">
          <div className="text-lg mt-2">
            {!latestCard?.id && (
              <span className="text-zinc-500">Crie seu primeiro FILE.</span>
            )}

            {latestCard?.id && (
              <div className="flex dark:bg-zinc-900 rounded gap-2 justify-between items-center">
                <span className="font-semibold text-zinc-500 px-3 text-base p-1 bg-zinc-200 dark:bg-zinc-800 rounded flex-nowrap flex-1 whitespace-nowrap text-ellipsis overflow-hidden">
                  {latestCard?.title}
                </span>
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
    </div>
  );
};
