import "dayjs/locale/pt-br";

import { fontFiraCode } from "@/fonts";
import { animate, delay, motion } from "framer-motion";
import { BsArrowLeft, BsArrowRight } from "react-icons/bs";
import {
  MdKeyboardArrowLeft,
  MdKeyboardArrowRight,
  MdViewWeek,
} from "react-icons/md";

import { api } from "@/api";
import { useQuery } from "@tanstack/react-query";
import dayjs, { locale } from "dayjs";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { CgCheck } from "react-icons/cg";
import AddTaskModal from "./add-task";
import { log } from "console";
import { get } from "http";
import { type } from "os";
import { format } from "path";
import { map } from "zod";

dayjs.locale("pt-br");

type ITask = {
  id: string;
  name: string;
  repeat: string | false;
  completed: string[];
  startAt: string | Date;
  endAt: string | Date;
  days: string[];
  deleted: string[];
};

type MdlOption = "new" | null | undefined;
const LINK_NAME = "mdl-option";

const useWeek = () => {
  const [startOf, setStartOf] = useState(dayjs().startOf("week"));
  const [endOf, setEndOf] = useState(dayjs().endOf("week"));

  const next = () => {
    setStartOf((prev) => prev.add(1, "week"));
    setEndOf((prev) => prev.add(1, "week"));
  };

  const back = () => {
    setStartOf((prev) => prev.subtract(1, "week"));
    setEndOf((prev) => prev.subtract(1, "week"));
  };

  const handleNow = () => {
    setStartOf(dayjs().startOf("week"));
    setEndOf(dayjs().endOf("week"));
  };

  const { data: tasks, isLoading } = useQuery<ITask[]>({
    queryKey: [
      "tasks",
      startOf.format("YYYY-MM-DD"),
      endOf.format("YYYY-MM-DD"),
    ],
    queryFn: async () => {
      const start = startOf.format("YYYY-MM-DD");
      const end = endOf.format("YYYY-MM-DD");

      return (
        (await api.get(`/tasks?startAt=${start}&endAt=${end}`)).data || null
      );
    },
  });

  const daysArray = Array.from(
    { length: endOf.diff(startOf, "day") + 1 },
    (_, i) => startOf.add(i, "day").format("MM/DD/YYYY")
  );

  const params = useSearchParams();
  const modal: MdlOption = (params.get(LINK_NAME) as MdlOption) || null;

  return {
    handles: { next, back, handleNow },
    states: { startOf, endOf, daysArray, modal },
    data: { isLoading, tasks },
  };
};

export function Week() {
  const {
    handles: { next, back, handleNow },
    states: { startOf, endOf, daysArray, modal },
    data: { isLoading, tasks },
  } = useWeek();

  console.log(tasks);

  const router = useRouter();
  const day = dayjs();
  const now = day.isBefore(endOf) && day.isAfter(startOf);

  return (
    <div className="flex w-full flex-col gap-3">
      <div className="mx-auto w-full max-w-[100rem]">
        <header className="justify-between flex w-full items-center gap-4 rounded-lg">
          <div className="flex gap-3 items-center cursor-default">
            <MdViewWeek />
            <span className={fontFiraCode}>Minha semana</span>
          </div>
        </header>
      </div>

      <div className="mx-auto flex flex-col w-full max-w-[100rem] bg-transparent rounded-md">
        <header className="w-full flex items-center justify-between rounded-full">
          <div className={`${fontFiraCode} text-sm flex flex-col gap-1`}>
            {day.format("dddd, DD MMMM")}
            <div className="bg-indigo-600 rounded p-1 grid place-items-center text-white">
              {day.format("YYYY")}
            </div>
          </div>

          <div className="flex gap-2">
            <span className="flex-1 flex bg-zinc-200 dark:bg-zinc-800 w-[1px]" />
            <button
              disabled={now}
              data-disabled={now}
              onClick={handleNow}
              className="opacity-95 transition-all hover:opacity-100 data-[disabled=true]:opacity-60 data-[disabled=true]:bg-zinc-200 data-[disabled=true]:text-zinc-700 
              dark:data-[disabled=true]:text-zinc-200 dark:data-[disabled=true]:bg-zinc-700 items-center px-3 flex gap-2 h-8 rounded-md bg-indigo-600 dark:bg-indigo-600 text-white shadow dark:shadow-black"
            >
              <span className={`${fontFiraCode}`}>Hoje</span>
            </button>
            <button
              onClick={() => router.push(`?${LINK_NAME}=new`)}
              className="opacity-95 hover:opacity-100 items-center px-3 flex gap-2 h-8 rounded-md bg-indigo-600 dark:bg-indigo-600 text-white shadow dark:shadow-black"
            >
              <span className={`${fontFiraCode}`}>Nova task</span>
            </button>

            <span className="flex-1 flex bg-zinc-200 dark:bg-zinc-800 w-[1px]" />

            <button
              type="button"
              onClick={back}
              className="grid opacity-90 hover:opacity-100 place-items-center w-8 h-8 rounded-full bg-white dark:bg-zinc-800/60 hover:shadow-lg dark:shadow-black shadow  border-l dark:border-zinc-800/70"
            >
              <BsArrowLeft />
            </button>
            <div className="flex items-center gap-2 bg-white dark:bg-zinc-800 opacity-60 px-3 rounded-md">
              <span className="flex items-center text-sm ">
                {startOf.format("DD-MM-YYYY")}
              </span>
              -
              <span className="flex items-center text-sm ">
                {endOf.format("DD-MM-YYYY")}
              </span>
            </div>
            <button
              type="button"
              onClick={next}
              className="grid opacity-90 hover:opacity-100 place-items-center w-8 h-8 rounded-full bg-white dark:bg-zinc-800/60 hover:shadow-lg dark:shadow-black shadow  border-l dark:border-zinc-800/70"
            >
              <BsArrowRight />
            </button>
          </div>
        </header>

        <section className="flex gap-5 overflow-hidden relative rounded">
          <div className="flex-col justify-center hidden px-4 opacity-50 bg-gradient-to-r from-zinc-200 dark:from-zinc-950/80 transition-opacity to-transparent hover:opacity-100 z-20 items-center absolute left-0 h-full">
            <button
              type="button"
              className="flex justify-end items-center py-5 backdrop-blur-md bg-zinc-100 dark:bg-zinc-900/40 hover:shadow-xl dark:shadow-black shadow opacity-90 hover:opacity-100 rounded dark:via-to-zinc-950 to-zinc-200 dark:to-zinc-950 p- right-0 top-0 border-l dark:border-zinc-800/70"
            >
              <MdKeyboardArrowLeft size={30} />
            </button>
          </div>

          <div className="w-full relative overflow-auto py-5 flex scroll-hidden flex-wrap gap-4 rounded-md dark:border-zinc-700/40">
            {daysArray?.map((day, index: number) => {
              const dayOfWeek = dayjs(day).day();
              const isCurrentDay =
                dayjs().format("DD-MM-YYYY") ===
                dayjs(day).format("DD-MM-YYYY");

              const style = isCurrentDay
                ? "shadow-lg border-indigo-500 dark:border-indigo-600 border-2 dark:shadow-indigo-600/20"
                : "";

              const tasksForDay = tasks?.filter((task) => {
                const taskStartAt = new Date(task?.startAt) || null;
                const taskEndAt = task?.endAt ? new Date(task.endAt) : null;

                const currentDay = new Date(dayjs(day).format("YYYY-MM-DD"));

                if (!taskEndAt) return task.days.includes(dayOfWeek.toString());

                return (
                  task.days.includes(dayOfWeek.toString()) &&
                  (!taskEndAt || taskEndAt >= currentDay) &&
                  !(currentDay < taskStartAt)
                );
              });

              return (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: (index + 1) / 100 }}
                  key={day}
                  className={`${style} rounded-xl flex gap-4 flex-col shadow dark:shadow-black bg-gray-100/50 flex-1 w-auto relative min-w-[20rem] min-h-[25rem] p-3 dark:bg-zinc-900/70`}
                >
                  {isCurrentDay && (
                    <span className="w-[95%] h-[0.4rem] bg-indigo-600 absolute top-0 left-[50%] translate-x-[-50%] translate-y-[-100%] rounded-t-lg" />
                  )}
                  <header className="w-full items-center p-1 rounded gap-2 text-zinc-700 capitalize dark:text-zinc-200 text-sm flex justify-between">
                    <span className="cursor-default whitespace-nowrap text-base font-semibold opacity-80">
                      {isCurrentDay ? "Hoje" : dayjs(day).format("dddd")}
                    </span>
                    <span className="text-xs opacity-40">
                      {dayjs(day).format("DD/MM/YYYY")}
                    </span>
                  </header>
                  <section className="flex flex-col">
                    {!tasksForDay?.length && (
                      <div className="flex p-1 px-2 bg-zinc-100 dark:bg-zinc-900 rounded opacity-60 text-sm">
                        Nenhuma Task para esse dia!
                      </div>
                    )}

                    {tasksForDay?.map((task) => {
                      const completed = task?.completed?.includes(
                        dayjs(day).format("YYYY-MM-DD")
                      );

                      return (
                        <div
                          key={task.id}
                          data-completed={completed}
                          className="px-2 flex gap-2 rounded mb-2 data-[completed=true]:border-indigo-500 data-[completed=true]:border-b-4 dark:data-[completed=true]:border-indigo-600 bg-white dark:bg-zinc-900 p-2 opacity-90 hover:opacity-100 border-b-2 dark:border-zinc-800"
                        >
                          <button
                            type="button"
                            data-completed={completed}
                            className="w-5 h-5 text-white bg-zinc-200 dark:bg-zinc-900 data-[completed=true]:bg-indigo-600 dark:data-[completed=true]:bg-indigo-600  rounded grid place-items-center border dark:border-zinc-700/70"
                          >
                            {completed && (
                              <motion.div
                                initial={{ opacity: 0, scale: 0 }}
                                animate={{ opacity: 1, scale: 1 }}
                              >
                                <CgCheck />
                              </motion.div>
                            )}
                          </button>
                          <span className="">{task.name}</span>
                        </div>
                      );
                    })}
                  </section>
                </motion.div>
              );
            })}
          </div>

          <div className="hidden flex-col justify-center px-4 opacity-50 bg-gradient-to-l from-zinc-200 dark:from-zinc-950/80 transition-opacity to-transparent hover:opacity-100 z-20 items-center absolute right-0 h-full">
            <button
              type="button"
              className="flex justify-end items-center py-5 backdrop-blur-md bg-zinc-100 dark:bg-zinc-900/40 hover:shadow-lg dark:shadow-black shadow opacity-90 hover:opacity-100 rounded dark:via-to-zinc-950 to-zinc-200 dark:to-zinc-950 p- right-0 top-0 border-l dark:border-zinc-800/70"
            >
              <MdKeyboardArrowRight size={30} />
            </button>
          </div>
        </section>
      </div>

      {modal === "new" && <AddTaskModal />}
    </div>
  );
}
