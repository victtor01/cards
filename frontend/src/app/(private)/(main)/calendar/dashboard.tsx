"use client";

/* 
 => quantidade de tasks ao total
 => tasks concluidas
 => tasks atrasadas
*/

import { api } from "@/api";
import { fontFiraCode } from "@/fonts";
import { useQuery } from "@tanstack/react-query";
import { FaHourglassEnd } from "react-icons/fa";

const useDashboardsTasks = () => {
  const { data } = useQuery<string[]>({
    queryKey: ["tasks", "lates"],
    queryFn: async () => (await api.get("/tasks/lates")).data,
  });

  return {
    data,
  };
};

function DashboardTasks() {
  const { data } = useDashboardsTasks();

  return (
    <section className="flex gap-4 items-center text-gray-600 dark:text-gray-300 my-2">
      <div className="flex p-4 bg-white flex-col dark:bg-neutral-900/60 border dark:border-zinc-700/20 shadow w-full max-w-lg flex-1 rounded-md">
        <header className="flex text-md items-center gap-2">
          <FaHourglassEnd size={15} />
          <h1 className={`${fontFiraCode} font-semibold`}>
            Total de tasks atrasadas
          </h1>
        </header>
        <section className="flex flex-col gap-2">
          <div
            data-lates={!!(data?.length && data?.length > 0)}
            className={`${fontFiraCode} data-[lates=true]:text-rose-600 font-semibold text-indigo-600 
              dark:text-indigo-600 items-center gap-1 flex data-[lates=true]:dark:text-rose-600 transition-colors`}
          >
            <span className="text-[3rem]">{data?.length}</span>
            <span className="mt-4 mx-2">Tasks atrasadas</span>
          </div>
        </section>
      </div>

      <div className="flex p-4 bg-white flex-col dark:bg-neutral-900/60 border dark:border-zinc-700/20 shadow w-full max-w-lg flex-1 rounded-md">
        <header className="flex text-md items-center gap-2">
          <FaHourglassEnd size={15} />
          <h1 className={`${fontFiraCode} font-semibold`}>
            Total de tasks atrasadas
          </h1>
        </header>
        <section className="flex flex-col gap-2">
          <div
            data-lates={!!(data?.length && data?.length > 0)}
            className={`${fontFiraCode} data-[lates=true]:text-rose-600 font-semibold text-indigo-600 
              dark:text-indigo-600 items-center gap-1 flex data-[lates=true]:dark:text-rose-600 transition-colors`}
          >
            <span className="text-[3rem]">{data?.length}</span>
            <span className="mt-4 mx-2">Tasks atrasadas</span>
          </div>
        </section>
      </div>

      <div className="flex p-4 bg-white flex-col dark:bg-neutral-900/60 border dark:border-zinc-700/20 shadow w-full max-w-lg flex-1 rounded-md">
        <header className="flex text-md items-center gap-2">
          <FaHourglassEnd size={15} />
          <h1 className={`${fontFiraCode} font-semibold`}>
            Total de tasks atrasadas
          </h1>
        </header>
        <section className="flex flex-col gap-2">
          <div
            data-lates={!!(data?.length && data?.length > 0)}
            className={`${fontFiraCode} data-[lates=true]:text-rose-600 font-semibold text-indigo-600 
              dark:text-indigo-600 items-center gap-1 flex data-[lates=true]:dark:text-rose-600 transition-colors`}
          >
            <span className="text-[3rem]">{data?.length}</span>
            <span className="mt-4 mx-2">Tasks atrasadas</span>
          </div>
        </section>
      </div>
    </section>
  );
}

export { DashboardTasks };
