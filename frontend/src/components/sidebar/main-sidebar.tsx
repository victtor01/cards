"use client";

import { fontFiraCode, fontRoboto, fontSaira } from "@/fonts";
import { useResize, useSidebar } from "@/hooks/use-sidebar";
import { useActionsWorkspaces } from "@/hooks/use-workspace";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { BiSearch } from "react-icons/bi";
import { FaHome, FaTrash } from "react-icons/fa";
import { HiFolderPlus } from "react-icons/hi2";
import { MdEditCalendar, MdSpaceDashboard } from "react-icons/md";
import { Trash } from "../trash";
import { UserComponent } from "./user-component";
import { WorkspaceLink } from "./workspace";

export function Sidebar() {
  const { workspaces, i } = useSidebar();
  const { createFolder } = useActionsWorkspaces();
  const { size, resizing, handler } = useResize();
  const trashOpen = "trash" === useSearchParams().get("md");
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div className="flex group/sidebar relative">
      <section
        className={`flex-col hidden lg:flex h-screen bg-gray-100 bg-opacity-50 dark:bg-neutral-900/20 border-r dark:border-zinc-900 dark:bg-opacity-80 overflow-visible relative`}
        style={{ width: size.x }}
      >
        <header className="flex p-2 items-center justify-between w-full">
          <div className={`flex gap-2 cursor-default`}>
            <div className="text-gray-200 bg-indigo-600 p-1 px-2 text-sm flex justify-center items-center gap-2 rounded">
              <span className={`${fontSaira} text-sm font-semibold`}>
                Organizze
              </span>
            </div>
          </div>

          <UserComponent photoUrl={i?.photo} />
        </header>

        <div className="w-full h-1 bg-zinc-200 bg-opacity-60 dark:bg-zinc-900" />

        <div className="flex w-full p-2 flex-col gap-2">
          <Link
            href={"/home"}
            data-selected={!!pathname.startsWith("/home")}
            className="flex items-center gap-2 text-black dark:text-zinc-300 opacity-70 hover:opacity-100 data-[selected=true]:dark:text-indigo-500 data-[selected=true]:text-indigo-600 data-[selected=true]:opacity-100"
          >
            <FaHome size={16} />
            <span className={fontFiraCode}>Home</span>
          </Link>

          <Link
            href={"/calendar"}
            data-selected={!!pathname.startsWith("/calendar")}
            className="flex items-center gap-2 text-black dark:text-zinc-300 opacity-70 hover:opacity-100 data-[selected=true]:dark:text-indigo-500 data-[selected=true]:text-indigo-600 data-[selected=true]:opacity-100"
          >
            <MdEditCalendar size={16} />
            <span className={fontFiraCode}>Week</span>
          </Link>

          <div className="relative">
            <button
              type="button"
              data-open={trashOpen}
              onClick={() => router.push("?md=trash")}
              className="flex items-center justify-between gap-2 text-black dark:text-zinc-300 opacity-70 hover:opacity-100 dark:data-[open=true]:text-indigo-500 dark:data-[open=true]:opacity-100 data-[open=true]:text-indigo-600 data-[open=true]:opacity-100"
            >
              <div className="flex gap-2 items-center">
                <FaTrash size={12} />
                <span className={fontFiraCode}>Trash</span>
              </div>
            </button>

            {trashOpen && <Trash />}
          </div>

          <Link
            href={"#"}
            className="flex items-center justify-between gap-2 text-black dark:text-zinc-300 opacity-70 hover:opacity-100"
          >
            <div className="flex gap-2 items-center">
              <BiSearch size={16} />
              <span className={fontFiraCode}>Search</span>
            </div>

            <div className="grid place-items-center px-2 text-xs bg-white text-zinc-600 rounded p-1 font-semibold dark:bg-zinc-900 dark:text-zinc-100 border dark:border-zinc-800">
              <span className={fontRoboto}>Ctr + K</span>
            </div>
          </Link>
        </div>

        <div className="w-full h-1 bg-zinc-200 bg-opacity-60 dark:bg-zinc-900" />

        <div className={`${fontFiraCode} px-2 flex justify-between mt-1`}>
          <div className="text-zinc-400">Workspaces</div>
          <div className="text-zinc-500">
            <MdSpaceDashboard />
          </div>
        </div>

        <section className="gap-4 pb-5 overflow-hidden flex flex-col relative h-full">
          <div className="mt-2 w-full px-2 justify-between items-center flex">
            <button
              onClick={() => createFolder()}
              className="w-auto gap-3 px-3 h-8 flex items-center bg-white dark:bg-zinc-900 border dark:text-zinc-200 dark:hover:text-white justify-center bg-transparent text-gray-500 rounded opacity-90 hover:opacity-100"
            >
              <HiFolderPlus />
              <span className="text-sm capitalize">fold</span>
            </button>

            <div
              className="px-2 p-1 flex items-center justify-center gap-2 bg-white shadow opacity-50
              text-xs rounded-md dark:bg-neutral-600 text-gray-500 dark:text-gray-100"
            >
              <span>{workspaces?.length}</span>/<span>20</span>
            </div>
          </div>
          <div className="flex-1 flex p-2 flex-col h-full max-w-auto overflow-auto scroll-default">
            {workspaces?.[0]?.name &&
              workspaces?.map((workspace, index: number) => {
                return <WorkspaceLink key={index} {...workspace} />;
              })}
          </div>
        </section>
      </section>

      <button
        data-resizing={resizing}
        onMouseDown={handler}
        className="w-[0.1rem] overflow-visible hover:w-[0.3rem] data-[resizing=true]:bg-indigo-600 
        dark:data-[resizing=true]:bg-indigo-600 transition-all bg-zinc-300 opacity-0 
        group-hover/sidebar:opacity-100 dark:bg-zinc-800 hover:bg-indigo-500 
        dark:hover:bg-indigo-600 right-0 h-full absolute cursor-col-resize"
      />
    </div>
  );
}
