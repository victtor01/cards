import "dayjs/locale/pt-br";

import { fontFiraCode } from "@/fonts";
import { animate, AnimatePresence, delay, motion } from "framer-motion";
import { BsArrowLeft, BsArrowRight } from "react-icons/bs";
import { MdViewWeek } from "react-icons/md";

import { api } from "@/api";
import { ITask } from "@/interfaces/ITask";
import { queryClient } from "@/providers/query-client";
import { useQuery } from "@tanstack/react-query";
import dayjs, { Dayjs, locale } from "dayjs";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { CgCheck } from "react-icons/cg";
import { FaEye, FaEyeSlash, FaFile } from "react-icons/fa";
import { PiPlus } from "react-icons/pi";
import AddTaskModal from "./add-task";
import { DetailsTasks } from "./details-task";
import { log } from "console";
import { get } from "http";
import { type } from "os";
import { format } from "path";
import { set, map } from "zod";
import layout from "../layout";

dayjs.locale("pt-br");
type MdlOption = "new" | null | undefined;
const LINK_NAME = "mdl-option";
const DETAIL_NAME = "mdl-detail";

const useWeek = () => {
  const searchParams = useSearchParams();
  const startAtInitial = searchParams.get("startAt")
    ? dayjs(searchParams.get("startAt"))
    : null;

  const [visibleConclued, setVisibleConclued] = useState<boolean>(true);
  const [startOf, setStartOf] = useState<Dayjs>(
    startAtInitial || dayjs().startOf("week")
  );
  const [endOf, setEndOf] = useState<Dayjs>(
    startAtInitial?.endOf("week") || dayjs().endOf("week")
  );
  const router = useRouter();

  const taskIdDetail = searchParams.get(DETAIL_NAME);

  const handleVisibleConcluedItems = () => {
    setVisibleConclued((prev) => !prev);
  };

  const next = () => {
    setStartOf((prev) => {
      router.push(`?startAt=${prev.add(1, "week").format("YYYY-MM-DD")}`);
      return prev.add(1, "week");
    });

    setEndOf((prev) => prev.add(1, "week"));
  };

  const back = () => {
    setStartOf((prev) => prev.subtract(1, "week"));
    setEndOf((prev) => prev.subtract(1, "week"));
  };

  const handleNow = () => {
    setStartOf(dayjs().startOf("week"));
    setEndOf(dayjs().endOf("week"));
    router.push("?");
  };

  const openDetail = (taskId: string) => {
    router.push(`?${DETAIL_NAME}=${taskId}`);
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

  const completeTask = async (taskId: string, date: string) => {
    const task = tasks?.filter((task) => task.id === taskId)[0];
    if (!task) return;

    const includesInCompleted = task?.completed?.includes(date) || null;

    const prevTasks = task?.completed || [];
    const newArray = includesInCompleted
      ? prevTasks.filter((datePrev) => datePrev !== date)
      : [...prevTasks, date];

    await api.put(`/tasks/completed/${taskId}`, { arrayToConclude: newArray });
    await queryClient.invalidateQueries({ queryKey: ["tasks"] });
  };

  const daysArray = Array.from(
    { length: endOf.diff(startOf, "day") + 1 },
    (_, i) => startOf.add(i, "day").format("MM/DD/YYYY")
  );

  const params = useSearchParams();
  const modal: MdlOption = (params.get(LINK_NAME) as MdlOption) || null;

  return {
    handles: { next, back, handleNow, openDetail, handleVisibleConcluedItems },
    states: { startOf, endOf, daysArray, modal, visibleConclued },
    data: { isLoading, tasks, completeTask },
    params: { taskIdDetail },
  };
};

export function Week() {
  const {
    handles: { next, back, handleNow, openDetail, handleVisibleConcluedItems },
    states: { startOf, endOf, daysArray, modal, visibleConclued },
    data: { tasks, completeTask },
    params: { taskIdDetail },
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
    <>
      <div className="flex w-full flex-col gap-3 relative">
        <header className="mx-auto w-full max-w-[100rem]">
          <div className="justify-between flex w-full items-center gap-4 rounded-lg">
            <div className="flex gap-3 items-center cursor-default">
              <MdViewWeek />
              <span className={fontFiraCode}>Minha semana</span>
            </div>
          </div>

          <div className="w-full flex items-center justify-between rounded-full">
            <div
              className={`${fontFiraCode} text-sm flex flex-col gap-1 p-2 bg-zinc-200/50 dark:bg-zinc-800/50 rounded-md`}
            >
              {day.format("dddd, DD MMMM [de] YYYY")}
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleVisibleConcluedItems}
                className="opacity-95 hover:opacity-100 items-center px-3 flex gap-2 h-8 rounded-md bg-white dark:bg-zinc-800 text-zinc-500 dark:text-zinc-500 shadow dark:shadow-black"
              >
                <EyeComponent />
                Concluidos
              </button>

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
                onClick={addTaskModal}
                className="opacity-95 hover:opacity-100 items-center px-3 flex gap-2 h-8 rounded-md bg-indigo-600 dark:bg-indigo-600 text-white shadow dark:shadow-black"
              >
                <PiPlus />
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

        <div className="mx-auto gap-2 flex w-full relative transition-all overflow-visible max-w-[100rem] py-5 rounded-md">
          <div className="absolute top-0 left-0 overflow-hidden flex items-center flex-1 w-full h-full z-[0]">
            <div className="grid-image w-full h-full"></div>
          </div>

          <div className="w-full relative flex flex-wrap p-1 py-2 gap-10 scroll-hidden rounded-md dark:border-zinc-700/40">
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
                  const taskStartAt = task?.startAt
                    ? new Date(task.startAt)
                    : null;

                  const taskEndAt = task?.endAt ? new Date(task.endAt) : null;
                  const currentDay = new Date(dayjs(day).format("YYYY-MM-DD"));
                  const taskCompletedOnCurrentDay = task?.completed?.includes(
                    dayjs(day).format("YYYY-MM-DD")
                  );

                  const taskIsVisible =
                    visibleConclued || !taskCompletedOnCurrentDay;

                  const taskIsForToday = task.days.includes(
                    dayOfWeek.toString()
                  );

                  const taskIsWithinDateRange =
                    (!taskEndAt || taskEndAt >= currentDay) &&
                    (!taskStartAt || currentDay >= taskStartAt);

                  return (
                    taskIsVisible &&
                    (taskEndAt
                      ? taskIsForToday && taskIsWithinDateRange
                      : taskIsForToday)
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
                  className={`${style} rounded-xl flex gap-2 flex-col overflow-hidden shadow dark:shadow-black bg-white flex-1 w-auto relative min-w-[25rem] max-w-[50%] h-auto dark:bg-neutral-900/50`}
                >
                  {isCurrentDay && (
                    <span className="w-[98%] min-h-[0.4rem] bg-indigo-500 absolute top-0 left-[50%] translate-x-[-50%] translate-y-[-100%] rounded-t-lg" />
                  )}
                  <header className="w-full p-5 pb-0 items-center rounded gap-2 text-zinc-700 capitalize dark:text-zinc-200 text-sm flex justify-between">
                    <span className="cursor-default whitespace-nowrap text-base font-semibold opacity-80">
                      {isCurrentDay ? "Hoje" : dayjs(day).format("dddd")}
                    </span>
                    <span className="text-xs opacity-40">
                      {dayjs(day).format("DD/MM/YYYY")}
                    </span>
                  </header>
                  <section className="flex flex-col gap-3 pb-4 overflow-auto scroll-default pt-2 px-5 pr-3 flex-1 z-20 max-h-[20rem]">
                    <div className="">
                      <span
                        className={`${fontFiraCode} text-xs p-1 px-2 opacity-60 rounded bg-zinc-100 dark:bg-zinc-800`}
                      >
                        {tasksForDay?.length} Tasks para esse dia!
                      </span>
                    </div>
                    {tasksForDay?.map((task) => {
                      const selectedLink = taskIdDetail === task.id;
                      const completed = task?.completed?.includes(
                        dayjs(day).format("YYYY-MM-DD")
                      );

                      const diffInDays =
                        !!task.startAt && !!task.endAt
                          ? dayjs(task.endAt, "YYYY-MM-DD").diff(
                              dayjs(task.startAt, "YYYY-MM-DD"),
                              "day"
                            )
                          : null;

                      const diffWeekFormat =
                        diffInDays !== null ? Math.ceil(diffInDays / 7) : null;

                      const quantityOfTasks =
                        !!task.startAt && !!task.endAt && diffInDays
                          ? new Array(diffInDays)
                              .fill(null)
                              .reduce((count, _, i) => {
                                const currentDay = dayjs(
                                  task.startAt,
                                  "YYYY-MM-DD"
                                ).add(i, "day");
                                return (
                                  count +
                                  (task.days.includes(
                                    currentDay.day().toString()
                                  )
                                    ? 1
                                    : 0)
                                );
                              }, 0)
                          : 0;

                      const percentage =
                        !!task.completed?.length && quantityOfTasks
                          ? Math.ceil(
                              (task.completed.length / quantityOfTasks) * 100
                            )
                          : null;

                      console.log(
                        task?.completed?.length,
                        quantityOfTasks,
                        diffWeekFormat
                      );

                      return (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          key={`${task.id}-${day}`}
                          data-completed={completed}
                          data-linkselected={!!taskIdDetail && !selectedLink}
                          className="flex relative gap-2 p-1 overflow-visible rounded border z-[0] data-[linkselected=true]:blur-[2px] items-center data-[linkselected=true]:opacity-50 bg-zinc-100 dark:bg-neutral-900 transition-all data-[completed=true]:border-indigo-600 dark:data-[completed=true]:border-indigo-600 border-b-2 dark:border-zinc-800"
                        >
                          <button
                            onClick={() =>
                              completeTask(
                                task.id,
                                dayjs(day).format("YYYY-MM-DD")
                              )
                            }
                            type="button"
                            data-completed={completed}
                            className="min-w-6 min-h-6 text-white bg-zinc-200 dark:bg-zinc-900 data-[completed=true]:bg-indigo-600 
                              dark:data-[completed=true]:bg-indigo-600  rounded grid place-items-center border dark:border-zinc-700/70"
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
                            data-completed={completed}
                            className={`${fontFiraCode} overflow-hidden flex-1 whitespace-nowrap text-ellipsis text-md text-start gap-1 
                              data-[completed=true]:line-through data-[completed=true]:opacity-70`}
                          >
                            {task.name}
                          </button>
                          <div className="flex items-center gap-3">
                            <div className="p-1 px-2 bg-zinc-100 dark:bg-zinc-800 rounded text-xs opacity-60">
                              {task?.hour?.toString() || "Sem horário"}
                            </div>
                            <div className="flex gap-1 items-center text-zinc-400 opacity-70 text-sm">
                              <FaFile size={12} />
                              <span>2</span>
                            </div>
                            <span className="w-4 h-4 bg-orange-600 rounded" />
                          </div>

                          {diffWeekFormat && (
                            <div className="absolute top-[100%] flex left-0 bg-zinc-200 dark:bg-zinc-700 h-2 w-full rounded-b overflow-hidden">
                              <motion.div
                                layout
                                style={{ width: `${percentage}%` }}
                                className={`bg-gradient-to-r from-indigo-600 to-violet-500 h-full`}
                              />
                            </div>
                          )}
                        </motion.div>
                      );
                    })}
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
    </>
  );
}
