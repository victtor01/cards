import { fontFiraCode } from "@/fonts";
import dayjs from "dayjs";
import { BiPlus } from "react-icons/bi";

import { BsArrowLeft, BsArrowRight } from "react-icons/bs";
import { MdKeyboardArrowRight } from "react-icons/md";

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
    <div className="flex w-full">
      <div className="mx-auto flex flex-col bg-zinc-100/30 shadow overflow-hidden hover:delay-0 hover:shadow-xl transition-shadow w-full max-w-[70rem] dark:bg-zinc-900/80 rounded-md">
        <header className="p-3 px-4 w-full border-b-2 dark:border-zinc-800 flex items-center justify-between">
          <div className="items-center flex">
            <h1 className={fontFiraCode}>O que tenho essa semana...</h1>
          </div>
          <div className="flex gap-2 items-center">
            <button className="grid opacity-90 hover:opacity-100 place-items-center w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-950/40 hover:shadow-lg dark:shadow-black shadow  border-l dark:border-zinc-800/70">
              <BsArrowLeft />
            </button>
            <button className="grid opacity-90 hover:opacity-100 place-items-center w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-950/40 hover:shadow-lg dark:shadow-black shadow  border-l dark:border-zinc-800/70">
              <BsArrowRight />
            </button>
          </div>
        </header>
        <section className="flex gap-2 p-4 overflow-auto relative">
          <div className="w-full relative overflow-auto flex scroll-default gap-4">
            {daysArray?.map((day) => {
              return (
                <div className="flex gap-4 flex-col w-[10rem]">
                  <header className="w-full items-center p-1 dark:hover:bg-zinc-700/20 rounded gap-2 text-zinc-700 capitalize dark:text-zinc-200 text-sm flex">
                    <button className="rounded flex items-center justify-center w-6 h-6 border border-dashed dark:border-zinc-700 ">
                      <BiPlus />
                    </button>
                    <span className="cursor-default whitespace-nowrap">
                      {dayjs(day).format("dddd")}
                    </span>
                  </header>
                  <section className="flex flex-col">
                    <div></div>
                  </section>
                </div>
              );
            })}
          </div>

          <button
            type="button"
            className="flex justify-end items-center h-full backdrop-blur-md bg-zinc-100 dark:bg-zinc-950/40 hover:shadow-lg dark:shadow-black shadow opacity-90 hover:opacity-100 rounded dark:via-to-zinc-950 to-zinc-200 dark:to-zinc-950 p- right-0 top-0 border-l dark:border-zinc-800/70"
          >
            <MdKeyboardArrowRight size={30} />
          </button>
        </section>
      </div>
    </div>
  );
}
