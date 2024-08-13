"use client";

import { fontFiraCode } from "@/fonts";
import { useResize, useSidebar } from "@/hooks/use-sidebar";
import { FaUser } from "react-icons/fa";
import { MdSpaceDashboard } from "react-icons/md";
import { WorkspaceLink } from "./workspace";
import { HiFolderPlus } from "react-icons/hi2";
import Image from "next/image";
import { useRouter } from "next/navigation";

export function Sidebar() {
  const { workspaces, createFolder, i } = useSidebar();
  const { size, resizing, handler } = useResize();
  const router = useRouter();

  return (
    <div className="flex group/sidebar relative">
      <div
        className={`flex flex-col gap-2 h-screen bg-neutral-100 dark:bg-neutral-950 overflow-auto relative scroll-hidden`}
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
          <div className="flex gap-2">
            <button className="overflow-hidden transition-all hover:ring-2 hover:ring-indigo-400 dark:hover:ring-indigo-600 relative w-10 h-10 bg-white text-zinc-500 dark:bg-zinc-800 border dark:border-zinc-700 rounded-[100%] dark:text-zinc-300 grid place-items-center opacity-90 hover:opacity-100">
              <Image
                quality={1}
                src={`http://localhost:9000/uploads/${i?.photo}`}
                alt="photo"
                fill
                objectFit="cover"
              />
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
            className="border dark:border-zinc-800 rounded-md w-full flex items-center focus-within:ring-2 ring-indigo-500 dark:ring-indigo-600 ring-offset-1 transition-all ring-offset-zinc-900 bg-white dark:bg-transparent"
          >
            <input
              type="text"
              placeholder="study..."
              className="flex bg-transparent outline-none text-zinc-600 dark:text-zicn-200 w-full p-2 dark:placeholder:text-zinc-300 placeholder:text-zinc-600"
            />
            <button className="flex px-4 text-white bg-indigo-600 rounded mr-2 text-xs p-1 opacity-90 hover:opacity-100">
              <span className={fontFiraCode}>Go</span>
            </button>
          </label>
        </div>

        <section className="flex flex-col capitalize gap-1 pb-5 px-3">
          <div className="flex flex-1 flex-col rounded-lg overflow-hidden bg-white bg-opacity-80 dark:bg-zinc-900 p-2">
            {!!workspaces &&
              workspaces?.[0]?.name &&
              workspaces?.map(({ id, name, code, workspaces }) => {
                return <WorkspaceLink {...{ id, name, code, workspaces }} />;
              })}
          </div>

          <div className="px-2">
            <button
              onClick={() => createFolder()}
              className="w-auto gap-3 px-3 h-8 flex items-center justify-center bg-transparent border border-zinc-700 border-dashed text-gray-500 rounded opacity-90 hover:opacity-100 mt-3"
            >
              <HiFolderPlus />
              <span className="text-gray-500 text-sm capitalize">fold</span>
            </button>
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
