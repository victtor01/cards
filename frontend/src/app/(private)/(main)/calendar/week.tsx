import { fontFiraCode } from "@/fonts";

import { BiPlus } from "react-icons/bi";
import { BsArrowLeft, BsArrowRight } from "react-icons/bs";
import { CgCheck } from "react-icons/cg";
import {
  MdKeyboardArrowLeft,
  MdKeyboardArrowRight,
  MdViewWeek,
} from "react-icons/md";

import "dayjs/locale/pt-br";
import dayjs from "dayjs";
dayjs.locale("pt-br");

type Task = {
  id: string;
  name: string;
  weekly: boolean;
  completed: string[];
  startAt: string | Date;
  deleted: string[];
  days: number[];
};

const taskRepeat = {
  id: "exampleID",
  name: "example",
  weekly: true,
  startAt: new Date(),
  completed: ["09/15/2024"],
  deleted: [],
  days: [0, 1],
} satisfies Task;

const taskNotRepeat = {
  id: "exampleID",
  name: "example 2",
  startAt: new Date(),
  weekly: false,
  completed: [],
  deleted: [],
  days: [3],
} satisfies Task;

const dataExample: Task[] = [taskRepeat, taskNotRepeat];

const useWeek = () => {
  const startOf = dayjs().startOf("week");
  const endOf = dayjs().endOf("week");

  const daysArray = Array.from(
    { length: endOf.diff(startOf, "day") + 1 },
    (_, i) => startOf.add(i, "day").format("MM/DD/YYYY")
  );

  return { startOf, endOf, daysArray };
};

export function Week() {
  const { startOf, endOf, daysArray } = useWeek();

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

      <div className="mx-auto flex flex-col gap-5 bg-zinc-100/30 border dark:border-zinc-700/30 overflow-hidden w-full max-w-[70rem] dark:bg-neutral-900/80 rounded-md">
        <header className="p-3 px-4 bg-zinc-200/50 dark:bg-neutral-800/50 w-full flex items-center justify-between">
          <div className="items-center flex dark:text-zinc-400">
            <h1 className={fontFiraCode}>O que tenho essa semana...</h1>
          </div>
          <div className="flex gap-2">
            <button className="opacity-95 hover:opacity-100 items-center px-3 flex gap-2 h-8 rounded-full bg-indigo-500 text-white shadow-indigo-600/30 dark:shadow-indigo-600/50 hover:shadow-md shadow border-l dark:border-zinc-800/70">
              <BiPlus />
              <span className={`${fontFiraCode}`}>Create</span>
            </button>

            <span className="flex-1 flex bg-zinc-200 dark:bg-zinc-800 w-[1px]" />

            <button className="grid opacity-90 hover:opacity-100 place-items-center w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-950/40 hover:shadow-lg dark:shadow-black shadow  border-l dark:border-zinc-800/70">
              <BsArrowLeft />
            </button>
            <button className="grid opacity-90 hover:opacity-100 place-items-center w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-950/40 hover:shadow-lg dark:shadow-black shadow  border-l dark:border-zinc-800/70">
              <BsArrowRight />
            </button>
          </div>
        </header>
        <section className="flex gap-5 overflow-auto relative p-5 pb-8">
          <div className="flex flex-col justify-center items-center">
            <button
              type="button"
              className="flex justify-end items-center py-5 backdrop-blur-md bg-zinc-100 dark:bg-zinc-950/40 hover:shadow-xl dark:shadow-black shadow opacity-90 hover:opacity-100 rounded dark:via-to-zinc-950 to-zinc-200 dark:to-zinc-950 p- right-0 top-0 border-l dark:border-zinc-800/70"
            >
              <MdKeyboardArrowLeft size={30} />
            </button>
          </div>

          <div className="w-full relative overflow-auto flex scroll-default gap-4 p-5 border-t border-l rounded-md dark:border-zinc-700/40 shadow-md dark:shadow-zinc-950 pb-10">
            {daysArray?.map((day) => {
              const dayOfWeek = dayjs(day).day();
              const tasksForDay = dataExample.filter((task) =>
                task.days.includes(dayOfWeek)
              );

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
                    {tasksForDay.map((task) => {
                      const completed = task?.completed?.includes(day);

                      return (
                        <div
                          key={task.id}
                          className="p-1 px-2 flex gap-2  rounded mb-2 items-center"
                        >
                          <button
                            type="button"
                            data-completed={completed}
                            className="w-5 h-5 text-white bg-zinc-200 dark:bg-zinc-900 data-[completed=true]:bg-purple-600 rounded grid place-items-center border dark:border-zinc-700/70"
                          >
                            {completed && <CgCheck />}
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
              className="flex justify-end items-center py-5 backdrop-blur-md bg-zinc-100 dark:bg-zinc-950/40 hover:shadow-lg dark:shadow-black shadow opacity-90 hover:opacity-100 rounded dark:via-to-zinc-950 to-zinc-200 dark:to-zinc-950 p- right-0 top-0 border-l dark:border-zinc-800/70"
            >
              <MdKeyboardArrowRight size={30} />
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
