"use client";

import { fontFiraCode, fontInter } from "@/fonts";
import { useSidebar } from "@/hooks/use-sidebar";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaUser } from "react-icons/fa";
import { MdSpaceDashboard } from "react-icons/md";

export function Sidebar() {
  const pathname = usePathname();
  const { redirectTo, workspaces } = useSidebar();

  return (
    <div className="w-full max-w-[17rem] flex flex-col gap-5 border-r border-zinc-800 bg-gradient-to-b from-zinc-900 to-transparent">
      <header className="flex items-center justify-between p-2">
        <div className={`${fontFiraCode} flex gap-2`}>
          <button className="p-2 px-3 bg-indigo-600 rounded-md text-sm border border-indigo-500 opacity-80">
            Flards
          </button>
        </div>
        <div className="flex gap-2 ">
          <button className="w-10 h-10 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-300 grid place-items-center opacity-90 hover:opacity-100">
            <FaUser size={14} />
          </button>
        </div>
      </header>
      <div className={`${fontFiraCode} px-2 flex justify-between`}>
        <div className="text-zinc-400">Workspaces</div>
        <div className="text-zinc-500">
          <MdSpaceDashboard />
        </div>
      </div>
      <div className="flex w-full px-2">
        <label
          htmlFor="search"
          className="border border-zinc-800 rounded-md w-full flex items-center focus-within:ring-2 ring-indigo-600"
        >
          <input
            type="text"
            placeholder="study..."
            className="flex bg-transparent outline-none w-full p-2 placeholder:text-zinc-600"
          />
          <button className="flex px-4 bg-indigo-600 rounded mr-2 text-xs p-1 opacity-90 hover:opacity-100">
            <span className={fontFiraCode}>Go</span>
          </button>
        </label>
      </div>
      <section className="flex flex-col px-2 capitalize gap-1">
        {workspaces?.map(({ name, code }, index) => {
          const link = `/workspaces/${code}`;
          const selectedClassStyle = pathname.startsWith(link)
          ? "bg-zinc-800 text-gray-200 bg-opacity-70 opacity-100 cursor-default pointer-events-none"
          : "hover:text-gray-300 hover:bg-zinc-800 text-gray-500 hover:bg-opacity-70 opacity-80 hover:opacity-100";

          return (
            <button
              key={index}
              onClick={() => redirectTo(link)}
              className={`${selectedClassStyle} flex items-center justify-between p-2 px-2 rounded relative`}
            >
              <div className={`${fontInter} text-sm`}>{name}</div>
              <span className="w-5 h-5 text-xs bg-indigo-600 rounded grid place-items-center text-zinc-300">
                2
              </span>
            </button>
          );
        })}
        <div>
          <button
            onClick={() => redirectTo("?md=create-workspace")}
            className="px-4 flex p-1 bg-transparent border border-zinc-700 border-dashed rounded opacity-90 hover:opacity-100 mt-3"
          >
            <span className="text-gray-500 text-sm">Create new</span>
          </button>
        </div>
      </section>
    </div>
  );
}
