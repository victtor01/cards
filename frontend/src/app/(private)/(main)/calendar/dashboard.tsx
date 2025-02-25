"use client";

import { api } from "@/api";
import { fontFiraCode, fontSaira } from "@/fonts";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import { useState } from "react";
import { BsArrowRightShort } from "react-icons/bs";
import { FaHourglassEnd } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { AnimatePresence, motion } from "framer-motion";

type TaskLate = {
  id: string;
  name: string;
  date: Date | string;
};

const useDashboardsTasks = () => {
  const [tasksVisible, setTasksVisible] = useState<boolean>(false);
  const handleTasksVisible = () => setTasksVisible((prev) => !prev);

  const { data } = useQuery<TaskLate[]>({
    queryKey: ["tasks", "lates"],
    queryFn: async () => (await api.get("/tasks/lates")).data,
  });

  return {
    data,
    tasksVisible,
    handleTasksVisible,
  };
};

function DashboardTasks() {
  const { data, tasksVisible, handleTasksVisible } = useDashboardsTasks();

  return (
    <section className="flex gap-4 text-gray-600 dark:text-gray-300 my-2 overflow-visible max-w-main w-full mx-auto">
      <div className="flex p-4 bg-white flex-col dark:bg-neutral-900 shadow shadow-gray-300/40 dark:shadow-black w-full max-w-lg flex-1 rounded-xl">
        <header className="flex text-md items-center gap-2">
          <FaHourglassEnd size={15} />
          <h1
            className={`${fontSaira} font-semibold text-gray-500 dark:text-gray-300`}
          >
            Total de tarefas atrasadas
          </h1>
        </header>
        <section className="flex flex-col gap-2 rounded-lg mt-1">
          <div
            data-lates={data?.length && data?.length > 0}
            className={`${fontFiraCode} data-[lates=true]:text-rose-600 font-semibold text-indigo-600 
            dark:text-indigo-600 items-center gap-1 flex data-[lates=true]:dark:text-rose-600 transition-colors`}
          >
            <span className="text-[3rem]">{data?.length || 0}</span>
            <span className="mt-4 mx-2">Tasks atrasadas</span>
          </div>
        </section>
        <footer className="mt-2 relative overflow-visible">
          <button
            data-open={tasksVisible}
            type="button"
            onClick={handleTasksVisible}
            className={`${fontSaira} items-center data-[open=true]:bg-indigo-600 dark:data-[open=true]:bg-indigo-600 dark:data-[open=true]:text-white data-[open=true]:text-white
            text-sm opacity-90 hover:opacity-100 gap-2 flex p-1 bg-gray-100 text-zinc-500 dark:bg-zinc-800 rounded px-2`}
          >
            <span>{tasksVisible ? "Fechar" : "Visualizar"}</span>
            {tasksVisible ? <IoClose /> : <BsArrowRightShort size={20} />}
          </button>

          <AnimatePresence>
            {tasksVisible && (
              <motion.div
                key={"teste"}
                initial={{ opacity: 0.6, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="flex absolute border dark:border-zinc-700/30 flex-col overflow-auto gap-2 shadow-xl dark:shadow-black scroll-default top-[100%] mt-1 w-full max-w-[20rem] h-[10rem] p-3 bg-white dark:bg-neutral-900 z-20 rounded-md"
              >
                {data?.map((taskLate: TaskLate, index: number) => {
                  const { name, date, id } = taskLate;
                  return (
                    <div
                      key={index}
                      className={`${fontSaira} flex gap-2 items-center`}
                    >
                      <button className="bg-indigo-600 p-1 px-2 text-white text-xs border dark:border-zinc-700 rounded-md">
                        Concluir
                      </button>
                      <span className="dark:text-zinc-400 cursor-default overflow-hidden  text-ellipsis text-nowrap">
                        {name}
                      </span>
                      <span className="dark:text-zinc-600 text-sm flex-1 text-nowrap">
                        {dayjs(date).format("DD [de] MMM, YYYY")}
                      </span>
                    </div>
                  );
                })}
                {!data?.length && (
                  <div className="flex items-center justify-center flex-1 w-full h-full">
                    <span className="opacity-70">Nenhuma task atrasada!</span>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </footer>
      </div>

      <div className="flex p-4 bg-white flex-col dark:bg-neutral-900/60 shadow shadow-gray-300/40 dark:shadow-black w-full max-w-lg flex-1 rounded-xl">
        <div className="flex self-center items-center justify-center flex-1 justify-self-center text-zinc-500 font-semibold">
          <span className={`${fontSaira} text-lg`}>Em breve...</span>
        </div>
      </div>

      <div className="flex p-4 bg-white flex-col dark:bg-neutral-900/60 shadow shadow-gray-300/40 dark:shadow-black w-full max-w-lg flex-1 rounded-xl">
        <div className="flex self-center items-center justify-center flex-1 justify-self-center text-zinc-500 font-semibold">
          <span className={`${fontSaira} text-lg`}>Em breve...</span>
        </div>
      </div>
    </section>
  );
}

export { DashboardTasks };
