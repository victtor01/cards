import { Week } from "@/components/Week";
import { fontFiraCode } from "@/fonts";
import { MdViewWeek } from "react-icons/md";
import { DashboardTasks } from "./dashboard";

export default function Calendar() {
  return (
    <div className="w-full flex-col max-w-[75rem] flex gap-2 p-5 bg-transparent mx-auto">
      <header className="flex gap-3">
        <div
          className={`${fontFiraCode} rounded bg-white dark:bg-zinc-800/70 px-2 border dark:border-zinc-700/40 p-1 text-zinc-600 items-center flex gap-2 font-semibold text-md dark:text-zinc-200`}
        >
          <MdViewWeek />
          Minha semana
        </div>
      </header>
      <DashboardTasks />
      <Week />
    </div>
  );
}
