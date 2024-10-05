import "dayjs/locale/pt-br";

import { fontFiraCode } from "@/fonts";
import { AnimatePresence, motion } from "framer-motion";
import { BsArrowLeft, BsArrowRight } from "react-icons/bs";
import {
  MdKeyboardArrowLeft,
  MdKeyboardArrowRight,
  MdViewWeek,
} from "react-icons/md";

import { api } from "@/api";
import { queryClient } from "@/providers/query-client";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { CgCheck } from "react-icons/cg";
import { FaFile } from "react-icons/fa";
import AddTaskModal from "./add-task";
import { DetailsTasks } from "./details-task";

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
  createdAt: Date | string;
};

type MdlOption = "new" | null | undefined;
const LINK_NAME = "mdl-option";
const DETAIL_NAME = "mdl-detail";

const useWeek = () => {
  const [startOf, setStartOf] = useState(dayjs().startOf("week"));
  const [endOf, setEndOf] = useState(dayjs().endOf("week"));
  const router = useRouter();

  const searchParams = useSearchParams();
  const taskIdDetail = searchParams.get(DETAIL_NAME);

  function next() {
    setStartOf((prev) => prev.add(1, "week"));
    setEndOf((prev) => prev.add(1, "week"));
  }

  function back() {
    setStartOf((prev) => prev.subtract(1, "week"));
    setEndOf((prev) => prev.subtract(1, "week"));
  }

  function handleNow() {
    setStartOf(dayjs().startOf("week"));
    setEndOf(dayjs().endOf("week"));
  }

  function openDetail(taskId: string) {
    router.push(`?${DETAIL_NAME}=${taskId}`);
  }

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

  const completeTask = async (taskId: string, date: string) => {
    const task = tasks?.filter((task) => task.id === taskId)[0];
    if (!task) return;

    const includesInCompleted = task?.completed?.includes(date) || null;

    if (!includesInCompleted) {
      const prevTasks = task?.completed || [];
      const newArray: string[] = [...prevTasks, date];
      await api.put(`/tasks/${taskId}`, {
        arrayToConclude: newArray,
      });
      await queryClient.invalidateQueries({
        queryKey: ["tasks"],
      });
    } else {
      const prevTasks = task?.completed || [];
      const newArray: string[] = [
        ...prevTasks?.filter((datePrev) => datePrev !== date),
      ];
      await api.put(`/tasks/${taskId}`, {
        arrayToConclude: newArray,
      });
      await queryClient.invalidateQueries({
        queryKey: ["tasks"],
      });
    }
  };

  const daysArray = Array.from(
    { length: endOf.diff(startOf, "day") + 1 },
    (_, i) => startOf.add(i, "day").format("MM/DD/YYYY")
  );

  const params = useSearchParams();
  const modal: MdlOption = (params.get(LINK_NAME) as MdlOption) || null;

  return {
    handles: { next, back, handleNow, openDetail },
    states: { startOf, endOf, daysArray, modal },
    data: { isLoading, tasks, completeTask },
    params: { taskIdDetail },
  };
};

export function Week() {
  const {
    handles: { next, back, handleNow, openDetail },
    states: { startOf, endOf, daysArray, modal },
    data: { tasks, completeTask },
    params: { taskIdDetail },
  } = useWeek();

  const router = useRouter();
  const day = dayjs();

  const now = day.isBefore(endOf) && day.isAfter(startOf);

  return (
    <>
      <div className="flex w-full flex-col gap-3 relative">
        <header className="mx-auto w-full max-w-[120rem]">
          <div className="justify-between flex w-full items-center gap-4 rounded-lg">
            <div className="flex gap-3 items-center cursor-default">
              <MdViewWeek />
              <span className={fontFiraCode}>Minha semana</span>
            </div>
          </div>

          <div className="w-full flex items-center justify-between rounded-full">
            <div className={`${fontFiraCode} text-sm flex flex-col gap-1`}>
              {day.format("dddd, DD MMMM")}
              <div className="bg-indigo-600 rounded p-1 grid place-items-center text-white">
                {day.format("YYYY")}
              </div>
            </div>

            <div className="flex gap-2">
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
                className="grid opacity-90 hover:opacity-100 place-items-center w-8 h-8 rounded-lg bg-white dark:bg-zinc-800/60 hover:shadow-lg dark:shadow-black shadow  border-l dark:border-zinc-800/70"
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
                className="grid opacity-90 hover:opacity-100 place-items-center w-8 h-8 rounded-lg bg-white dark:bg-zinc-800/60 hover:shadow-lg dark:shadow-black shadow  border-l dark:border-zinc-800/70"
              >
                <BsArrowRight />
              </button>
            </div>
          </div>
        </header>

        <motion.div className="mx-auto gap-2 flex w-full relative transition-all max-w-[120rem] py-3 rounded-md">
          <div className="absolute top-0 left-0 overflow-hidden flex items-center flex-1 w-full h-full z-[0]">
            <div className="grid-image w-full h-full"></div>
          </div>

          <section className="">
            <section className="flex gap-5 overflow-hidden relative rounded">
              <div className="flex-col justify-center hidden px-4 opacity-50 bg-gradient-to-r from-zinc-200 dark:from-zinc-950/80 transition-opacity to-transparent hover:opacity-100 z-20 items-center absolute left-0 h-full">
                <button
                  type="button"
                  className="flex justify-end items-center py-5 backdrop-blur-md bg-zinc-100 dark:bg-zinc-900/40 hover:shadow-xl dark:shadow-black shadow opacity-90 hover:opacity-100 rounded dark:via-to-zinc-950 to-zinc-200 dark:to-zinc-950 p- right-0 top-0 border-l dark:border-zinc-800/70"
                >
                  <MdKeyboardArrowLeft size={30} />
                </button>
              </div>

              <div className="w-full relative overflow-auto flex scroll-hidden flex-wrap gap-4 rounded-md dark:border-zinc-700/40">
                {daysArray?.map((day: string, index: number) => {
                  const dayOfWeek = dayjs(day).day();
                  const isCurrentDay =
                    dayjs().format("DD-MM-YYYY") ===
                    dayjs(day).format("DD-MM-YYYY");

                  const style = isCurrentDay
                    ? "shadow-lg border-indigo-400 dark:border-indigo-600 border-2 dark:shadow-indigo-600/20"
                    : "dark:border-zinc-800/30";

                  const tasksForDay = tasks
                    ?.filter((task: ITask) => {
                      const taskStartAt = new Date(task?.startAt) || null;
                      const taskEndAt = task?.endAt
                        ? new Date(task.endAt)
                        : null;

                      const currentDay = new Date(
                        dayjs(day).format("YYYY-MM-DD")
                      );

                      if (!taskEndAt)
                        return task.days.includes(dayOfWeek.toString());

                      return (
                        task.days.includes(dayOfWeek.toString()) &&
                        (!taskEndAt || taskEndAt >= currentDay) &&
                        !(currentDay < taskStartAt)
                      );
                    })
                    .sort(
                      (a, b) =>
                        new Date(a.createdAt).getTime() -
                        new Date(b.createdAt).getTime()
                    );

                  return (
                    <motion.div
                      key={day}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: (index + 1) / 100 }}
                      className={`${style} rounded-xl flex gap-4 border-r border-l flex-col dark:shadow-black dark:shadow bg-zinc-50/80 flex-1 w-auto relative min-w-[30rem] min-h-[30rem] p-3 dark:bg-neutral-900/30`}
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
                          const selectedLink = taskIdDetail === task.id;
                          const completed = task?.completed?.includes(
                            dayjs(day).format("YYYY-MM-DD")
                          );

                          return (
                            <motion.div
                              key={`${task.id}-${day}`}
                              data-completed={completed}
                              data-isLinkAndSelected={
                                !!taskIdDetail && !selectedLink
                              }
                              className="p-2 flex gap-2 rounded border mb-2 data-[isLinkAndSelected=true]:blur-[2px] items-center data-[isLinkAndSelected=true]:opacity-50 bg-zinc-100 dark:bg-neutral-900 transition-all data-[completed=true]:border-indigo-600 dark:data-[completed=true]:border-indigo-600 border-b-2 dark:border-zinc-800"
                            >
                              <div className="flex flex-col w-full gap-1">
                                <div className="flex gap-2 items-center w-full">
                                  <button
                                    onClick={() =>
                                      completeTask(
                                        task.id,
                                        dayjs(day).format("YYYY-MM-DD")
                                      )
                                    }
                                    type="button"
                                    data-completed={completed}
                                    className="w-6 h-6 text-white bg-zinc-200 dark:bg-zinc-900 data-[completed=true]:bg-indigo-600 dark:data-[completed=true]:bg-indigo-600  rounded grid place-items-center border dark:border-zinc-700/70"
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
                                  <button
                                    onClick={() => openDetail(task.id)}
                                    className="flex gap-2 justify-between items-center flex-1"
                                  >
                                    <span
                                      data-completed={completed}
                                      className={`${fontFiraCode} flex-1 text-start flex gap-1 data-[completed=true]:line-through data-[completed=true]:opacity-70`}
                                    >
                                      {task.name}
                                    </span>
                                    <div className="flex items-center gap-3">
                                      <div className="p-1 px-2 bg-zinc-100 dark:bg-zinc-800 rounded text-xs opacity-60">
                                        {dayjs(task.startAt).format(
                                          "DD, MM [de] YYYY - HH:mm"
                                        )}
                                      </div>
                                      <div className="flex gap-1 items-center text-zinc-400 opacity-70 text-sm">
                                        <FaFile size={12} />
                                        <span>2</span>
                                      </div>
                                      <span className="w-4 h-4 bg-orange-600 rounded" />
                                    </div>
                                  </button>
                                </div>
                              </div>
                            </motion.div>
                          );
                        })}
                        <div>
                          <span
                            className={`${fontFiraCode} text-xs p-1 px-2 opacity-60 rounded bg-zinc-100 dark:bg-zinc-800`}
                          >
                            {tasksForDay?.length} Tasks para esse dia!
                          </span>
                        </div>
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
          </section>

          {modal === "new" && <AddTaskModal />}

          <AnimatePresence>
            {!!taskIdDetail && <DetailsTasks taskId={taskIdDetail} />}
          </AnimatePresence>
        </motion.div>
      </div>
    </>
  );
}
