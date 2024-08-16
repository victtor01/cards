"use client";

import { fontFiraCode } from "@/fonts";
import { useResize, useSidebar } from "@/hooks/use-sidebar";
import { MdSpaceDashboard } from "react-icons/md";
import { WorkspaceLink } from "./workspace";
import { HiFolderPlus } from "react-icons/hi2";
import { useRouter } from "next/navigation";
import { UserComponent } from "./user";

export function Sidebar() {
  const { workspaces, createFolder, i } = useSidebar();
  const { size, resizing, handler } = useResize();
  const router = useRouter();

  return (
    <div className="flex group/sidebar relative">
      <div
        className={`flex flex-col gap-2 h-screen bg-gray-100 bg-opacity-60 dark:bg-neutral-950 overflow-visible relative`}
        style={{ width: size.x }}
      >
        <header className="flex items-center justify-between p-2">
          <div className={`${fontFiraCode} flex gap-2`}>
            <button
              onClick={() => router.push("/home")}
              className="p-2 px-3 bg-indigo-600 text-white rounded-md text-sm border border-indigo-500 opacity-80"
            >
              Flards
            </button>
          </div>
          <div className="flex gap-2 relative">
            <UserComponent photoUrl={i?.photo} />
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
            className="border dark:border-zinc-800 rounded-md dark:bg-zinc-800 w-full flex items-center focus-within:ring-2 ring-indigo-400 dark:ring-indigo-600 ring-offset-1 transition-all ring-offset-white dark:ring-offset-zinc-900 bg-white dark:bg-transparent"
          >
            <input
              type="text"
              placeholder="study..."
              className="flex bg-transparent px-2 font-semibold outline-none text-zinc-500 dark:text-zinc-300 w-full p-1 dark:placeholder:text-zinc-300 placeholder:text-zinc-400 placeholder:text-sm"
            />
            <button className="flex px-4 text-white bg-indigo-600 rounded mr-1 text-xs p-1 opacity-90 hover:opacity-100">
              <span className={fontFiraCode}>Go</span>
            </button>
          </label>
        </div>

        <section className="gap-4 pb-5 px-3 overflow-hidden flex flex-col relative">
          <div>
            <button
              onClick={() => createFolder()}
              className="w-auto gap-3 px-3 h-8 flex items-center bg-white dark:bg-zinc-800 dark:text-zinc-200 dark:hover:text-white justify-center bg-transparent border border-zinc-700 border-dashed text-gray-500 rounded opacity-90 hover:opacity-100 mt-3"
            >
              <HiFolderPlus />
              <span className="text-sm capitalize">fold</span>
            </button>
          </div>
          <div className="flex-1 flex flex-col h-full max-w-auto rounded-lg bg-white dark:bg-zinc-900 p-2 overflow-auto scroll-default shadow-lg dark:shadow-xl dark:shadow-black dark:border dark:border-zinc-800">
            {!!workspaces &&
              workspaces?.[0]?.name &&
              workspaces?.map(({ id, name, code, workspaces, cards }) => {
                return (
                  <WorkspaceLink {...{ id, name, code, workspaces, cards }} />
                );
              })}
          </div>
        </section>
      </div>

      <button
        data-resizing={resizing}
        onMouseDown={handler}
        className="w-[0.1rem] overflow-visible hover:w-[0.3rem] data-[resizing=true]:bg-indigo-600 dark:data-[resizing=true]:bg-indigo-600 transition-all bg-zinc-300 opacity-0 group-hover/sidebar:opacity-100 dark:bg-zinc-800 hover:bg-indigo-500 dark:hover:bg-indigo-600 right-0 h-full absolute cursor-col-resize"
      />
    </div>
  );
}
