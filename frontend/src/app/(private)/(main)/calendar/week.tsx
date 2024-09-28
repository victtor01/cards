import { fontFiraCode } from "@/fonts";

import { BiPlus } from "react-icons/bi";
import { BsArrowLeft, BsArrowRight } from "react-icons/bs";
import { motion } from "framer-motion";
import {
  MdKeyboardArrowLeft,
  MdKeyboardArrowRight,
  MdViewWeek,
} from "react-icons/md";

import dayjs, { locale } from "dayjs";
import "dayjs/locale/pt-br";
import { CgCheck } from "react-icons/cg";
import { useRouter, useSearchParams } from "next/navigation";
import AddTaskModal from "./add-task";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/api";
import { useState } from "react";
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

/* const taskRepeat = {
  id: "exampleID",
  name: "example",
  repeat: "weekly",
  startAt: new Date(),
  completed: ["09/15/2024"],
  deleted: [],
  days: [0, 1],
} satisfies ITask;

const taskNotRepeat = {
  id: "exampleID",
  name: "example 2",
  startAt: new Date(),
  repeat: false,
  completed: [],
  deleted: [],
  days: [3],
} satisfies ITask;

const dataExample: ITask[] = [taskRepeat, taskNotRepeat]; */

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

  const { data: tasks } = useQuery<ITask[]>({
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

  return { startOf, endOf, daysArray, modal, tasks, next, back };
};

export function Week() {
  const { daysArray, modal, tasks, next, back, startOf, endOf } = useWeek();
  const router = useRouter();

  console.log(tasks);

  return (
    <div className="flex w-full flex-col gap-3">
      <div className="mx-auto w-full max-w-main">
        <header className="justify-between flex w-full items-center gap-4 rounded-lg">
          <div className="flex gap-3 items-center cursor-default">
            <MdViewWeek />
            <span className={fontFiraCode}>Minha semana</span>
          </div>
        </header>
      </div>

      <div className="mx-auto flex flex-col gap-5 w-full max-w-[70rem] bg-transparent rounded-md">
        <header className="p-3 px-4 bg-zinc-200/50 dark:bg-neutral-800/50 w-full flex items-center justify-between rounded-md">
          <div className="items-center flex dark:text-zinc-400">
            <h1 className={fontFiraCode}>O que tenho essa semana...</h1>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => router.push(`?${LINK_NAME}=new`)}
              className="opacity-95 hover:opacity-100 items-center px-3 flex gap-2 h-8 rounded-md bg-indigo-500 dark:bg-indigo-600 text-white shadow dark:shadow-black"
            >
              <BiPlus />
              <span className={`${fontFiraCode}`}>Create</span>
            </button>

            <span className="flex-1 flex bg-zinc-200 dark:bg-zinc-800 w-[1px]" />

            <button
              type="button"
              onClick={back}
              className="grid opacity-90 hover:opacity-100 place-items-center w-8 h-8 rounded-full bg-white dark:bg-zinc-950/40 hover:shadow-lg dark:shadow-black shadow  border-l dark:border-zinc-800/70"
            >
              <BsArrowLeft />
            </button>
            <span className="flex items-center text-sm opacity-50">
              {startOf.format("DD-MM-YYYY")}
            </span>
            <button
              type="button"
              onClick={next}
              className="grid opacity-90 hover:opacity-100 place-items-center w-8 h-8 rounded-full bg-white dark:bg-zinc-950/40 hover:shadow-lg dark:shadow-black shadow  border-l dark:border-zinc-800/70"
            >
              <BsArrowRight />
            </button>
          </div>
        </header>

        <section className="flex gap-5 overflow-auto relative">
          <div className="flex flex-col justify-center items-center">
            <button
              type="button"
              className="flex justify-end items-center py-5 backdrop-blur-md bg-zinc-100 dark:bg-zinc-900/40 hover:shadow-xl dark:shadow-black shadow opacity-90 hover:opacity-100 rounded dark:via-to-zinc-950 to-zinc-200 dark:to-zinc-950 p- right-0 top-0 border-l dark:border-zinc-800/70"
            >
              <MdKeyboardArrowLeft size={30} />
            </button>
          </div>

          <div className="w-full relative overflow-auto flex scroll-hidden bg-zinc-100/20 dark:bg-neutral-900/40 gap-4 p-5 border rounded-md dark:border-zinc-700/40">
            {daysArray?.map((day) => {
              const dayOfWeek = dayjs(day).day();

              const tasksForDay = tasks?.filter((task) => {
                const taskEndAt = task?.endAt ? new Date(task.endAt) : null;

                const currentDay = new Date(dayjs(day).format("YYYY-MM-DD"));

                if (!taskEndAt) {
                  return task.days.includes(dayOfWeek.toString());
                }

                return (
                  task.days.includes(dayOfWeek.toString()) &&
                  (!taskEndAt || taskEndAt >= currentDay)
                );
              });

              return (
                <div
                  key={day}
                  className="flex gap-4 flex-col w-auto min-w-[15rem] p-3 bg-zinc-100/60 dark:bg-neutral-950/60 rounded-lg"
                >
                  <header className="w-full items-center p-1 rounded gap-2 text-zinc-700 capitalize dark:text-zinc-200 text-sm flex">
                    <span className="cursor-default whitespace-nowrap">
                      {dayjs(day).format("dddd")}
                    </span>
                    <span className="text-xs opacity-40">{day}</span>
                  </header>
                  <section className="flex flex-col">
                    {!tasksForDay?.length && (
                      <div className="flex p-1 px-2 bg-zinc-100 dark:bg-zinc-900 rounded opacity-60 text-sm">
                        Nenhuma Task para esse dia!
                      </div>
                    )}

                    {tasksForDay?.map((task) => {
                      const completed = task?.completed?.includes(day);

                      return (
                        <div
                          key={task.id}
                          className="p-1 px-2 flex gap-2 rounded mb-2 items-center"
                        >
                          <button
                            type="button"
                            data-completed={completed}
                            className="w-5 h-5 text-white bg-zinc-200 dark:bg-zinc-900 data-[completed=true]:bg-purple-600 rounded grid place-items-center border dark:border-zinc-700/70"
                          >
                            {completed && (
                              <motion.div initial={{ opacity: 0, scale: 0 }}>
                                <CgCheck />
                              </motion.div>
                            )}
                          </button>
                          <span>{task.name}</span>
                        </div>
                      );
                    })}
                  </section>
                </div>
              );
            })}
          </div>

          <div className="flex flex-col justify-center items-center">
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
