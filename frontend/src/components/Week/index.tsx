"use client";

import "dayjs/locale/pt-br";

import AddTaskModal from "@/app/(private)/(main)/calendar/add-task";
import { DetailsTasks } from "@/app/(private)/(main)/calendar/details-task";
import { fontFiraCode } from "@/fonts";
import { ITask } from "@/interfaces/ITask";
import { GetTasksInDay } from "@/utils/get-tasks-in-day";
import dayjs from "dayjs";
import { AnimatePresence, motion } from "framer-motion";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { BsArrowLeft, BsArrowRight } from "react-icons/bs";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { MdViewWeek } from "react-icons/md";
import { PiPlus } from "react-icons/pi";
import { useWeek } from "./hooks";
import { TaskItem } from "./task";

const LINK_NAME = "mdl-option";

dayjs.locale("pt-br");

export function Week() {
  const {
    handles: { next, back, handleNow, handleVisibleConcluedItems },
    states: { startOf, endOf, daysArray, modal, visibleConclued },
    params: { taskIdDetail },
    data: { tasks },
  } = useWeek();

  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const day = dayjs();

  const addTaskModal = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.set(LINK_NAME, "new");

    router.push(`${pathname}?${params.toString()}`);
  };

  const EyeComponent = visibleConclued ? FaEye : FaEyeSlash;
  const now = day.isBefore(endOf) && day.isAfter(startOf);

  return (
    <div className="flex w-full flex-col gap-3 relative">
      <header className="mx-auto w-full max-w-[100rem]">
        <div className="justify-between flex w-full items-center gap-4 ">
          <div className="flex gap-3 items-center cursor-default">
            <MdViewWeek />
            <span className={fontFiraCode}>Minha semana</span>
          </div>
        </div>

        <div className="flex-1 flex items-center scroll-hidden justify-between gap-3 overflow-auto bg-white border-b-4 dark:bg-neutral-900/60 border dark:border-neutral-800 rounded-md p-2">
          <div className="flex gap-2 items-center">
            <button
              type="button"
              onClick={handleVisibleConcluedItems}
              className="opacity-95 hover:opacity-100 items-center px-3 flex gap-2 h-8 rounded dark:bg-zinc-800 text-zinc-500  dark:text-zinc-500 bg-zinc-200/70"
            >
              <EyeComponent />
              Concluidos
            </button>

            <button
              disabled={now}
              data-disabled={now}
              onClick={handleNow}
              className="opacity-95 transition-all hover:opacity-100 data-[disabled=true]:opacity-90 data-[disabled=true]:bg-zinc-200 data-[disabled=true]:text-zinc-500 
                  dark:data-[disabled=true]:text-zinc-200 dark:data-[disabled=true]:bg-zinc-700 items-center px-3 flex gap-2 h-8 rounded-md bg-indigo-600 dark:bg-indigo-600 text-white"
            >
              <span className={`${fontFiraCode}`}>Hoje</span>
            </button>
            <button
              onClick={addTaskModal}
              className="opacity-95 hover:opacity-100 items-center px-3 flex gap-2 h-8 rounded-md bg-violet-600 dark:bg-violet-600 text-white hover:shadow shadow hover:translate-y-[-1px]"
            >
              <PiPlus />
              <span className={`${fontFiraCode} whitespace-nowrap`}>
                Nova task
              </span>
            </button>
          </div>
          <div
            className={`${fontFiraCode} flex text-sm gap-1 bg-transparent lg:flex rounded-md text-nowrap whitespace-nowrap`}
          >
            <button
              type="button"
              onClick={back}
              className="grid opacity-95 hover:opacity-100 place-items-center w-8 h-8 text-white rounded-xl rounded-tr-md bg-indigo-600 dark:bg-indigo-600 dark:border-zinc-800/70"
            >
              <BsArrowLeft size={20} />
            </button>
            <div className="flex items-center gap-2 bg-gray-200 dark:bg-zinc-800 opacity-60 px-3 rounded-md">
              <span className="flex items-center text-sm whitespace-nowrap">
                {startOf.format("DD-MM-YYYY")}
              </span>
              -
              <span className="flex items-center text-sm whitespace-nowrap">
                {endOf.format("DD-MM-YYYY")}
              </span>
            </div>
            <button
              type="button"
              onClick={next}
              className="grid opacity-95 hover:opacity-100 place-items-center w-8 h-8 text-white rounded-xl rounded-bl-md bg-indigo-600 dark:bg-indigo-600 dark:border-zinc-800/70"
            >
              <BsArrowRight size={20} />
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto gap-2 flex w-full relative transition-all max-w-[100rem] rounded-md">
        <div className="absolute top-0 left-0 overflow-hidden flex items-center flex-1 w-full h-full z-[0]">
          <div className="grid-image w-full h-full"></div>
        </div>

        <div className="w-full relative flex-col lg:flex-row flex flex-wrap px-0 py-2 gap-10 scroll-hidden rounded-md dark:border-zinc-700/40">
          {daysArray?.map((day: string, index: number) => {
            const isCurrentDay =
              dayjs().format("DD-MM-YYYY") === dayjs(day).format("DD-MM-YYYY");

            const style = isCurrentDay
              ? "shadow-lg border-4 dark:border-indigo-600 shadow-none"
              : "dark:border-zinc-800/30";

            const tasksForDay = tasks?.length
              ? GetTasksInDay(tasks, day)
              : null;

            return (
              <motion.div
                key={day}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: [1.5, 1] }}
                transition={{ delay: (index + 1) / 100 }}
                className={`${style} rounded-xl flex gap-2 flex-col overflow-hidden shadow dark:shadow-black bg-white flex-1 relative w-full lg:min-w-[22rem] lg:max-w-[50%] min-h-[15rem] lg:min-h-none lg:h-auto dark:bg-neutral-900/50`}
              >
                <header className="w-full p-5 pb-0 items-center rounded gap-2 text-zinc-700 capitalize dark:text-zinc-200 text-sm flex justify-between">
                  <span className="cursor-default whitespace-nowrap text-base font-semibold opacity-80">
                    {isCurrentDay ? "Hoje" : dayjs(day).format("dddd")}
                  </span>
                  <span className="text-xs opacity-40">
                    {dayjs(day).format("DD/MM/YYYY")}
                  </span>
                </header>
                <section className="flex flex-col pb-9 gap-3 overflow-auto scroll-default pt-2 px-5 pr-3 flex-1 z-20 max-h-[20rem]">
                  <div className="">
                    <span
                      className={`${fontFiraCode} text-xs p-1 px-2 opacity-60 rounded bg-zinc-100 dark:bg-zinc-800`}
                    >
                      {tasksForDay?.length} Tasks para esse dia!
                    </span>
                  </div>

                  {tasksForDay?.map((task: ITask) => (
                    <TaskItem
                      day={day}
                      task={task}
                      
                      key={`${task.id}-${day}`}
                    />
                  ))}
                </section>
              </motion.div>
            );
          })}
        </div>

        {modal === "new" && <AddTaskModal />}

        <AnimatePresence>
          {!!taskIdDetail && <DetailsTasks taskId={taskIdDetail} />}
        </AnimatePresence>
      </div>
    </div>
  );
}
