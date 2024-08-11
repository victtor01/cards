"use client";

import { fontFiraCode } from "@/fonts";
import { useResize, useSidebar } from "@/hooks/use-sidebar";
import { FaUser } from "react-icons/fa";
import { MdSpaceDashboard } from "react-icons/md";
import { WorkspaceLink } from "./workspace";
import { HiFolderPlus } from "react-icons/hi2";

export function Sidebar() {
  const { redirectTo, workspaces } = useSidebar();
  const { size, resizing, handler } = useResize();
  
  return (
    <div
      className={`flex flex-col gap-5 bg-neutral-950 overflow-x-auto relative max-w-[50rem]`}
      style={{ width: size.x }}
    >
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
          className="border border-zinc-800 rounded-md w-full flex items-center focus-within:ring-2 ring-indigo-600 ring-offset-1 transition-all ring-offset-zinc-900"
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

      <section className="flex flex-col capitalize gap-1">
        <div className="flex flex-1 flex-col pl-2 overflow-hidden pb-5">
          {!!workspaces &&
            workspaces?.[0]?.name &&
            workspaces?.map(({ name, code, workspaces }) => {
              return <WorkspaceLink {...{ name, code, workspaces }} />;
            })}
        </div>

        <div className="px-2">
          <button
            onClick={() => redirectTo("?md=create-workspace")}
            className="w-auto gap-3 px-3 h-8 flex items-center justify-center bg-transparent border border-zinc-700 border-dashed text-gray-500  rounded opacity-90 hover:opacity-100 mt-3"
          >
            <HiFolderPlus />
            <span className="text-gray-500 text-sm capitalize">fold</span>
          </button>
        </div>
      </section>

      <button
        data-resizing={resizing}
        onMouseDown={handler}
        className="w-[0.1rem] overflow-visible hover:w-[0.3rem] data-[resizing=true]:bg-indigo-600 transition-all bg-zinc-800 hover:bg-indigo-600 right-0 h-full absolute  cursor-col-resize"
      />
    </div>
  );
}
