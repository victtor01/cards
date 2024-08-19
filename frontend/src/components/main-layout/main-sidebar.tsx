"use client";

import { fontFiraCode } from "@/fonts";
import { useResize, useSidebar } from "@/hooks/use-sidebar";
import { MdSpaceDashboard } from "react-icons/md";
import { WorkspaceLink } from "./workspace";
import { HiFolderPlus } from "react-icons/hi2";
import { usePathname, useRouter } from "next/navigation";
import { UserComponent } from "./user";
import { BiSearch } from "react-icons/bi";
import { FaHome } from "react-icons/fa";
import Link from "next/link";

const InputSearch = () => (
  <label
    htmlFor="search"
    className="border dark:border-zinc-800 rounded-md dark:bg-zinc-800 w-full flex items-center focus-within:ring-2 ring-indigo-400 dark:ring-indigo-600 ring-offset-1 transition-all ring-offset-white dark:ring-offset-zinc-900 bg-white dark:bg-transparent"
  >
    <input
      type="text"
      id="search"
      placeholder="study..."
      className="flex bg-transparent px-2 font-semibold outline-none text-zinc-500 dark:text-zinc-300 w-full p-1 dark:placeholder:text-zinc-300 placeholder:text-zinc-400 placeholder:text-sm"
    />
    <button className="flex px-4 text-white bg-indigo-600 rounded mr-1 text-xs p-1 opacity-90 hover:opacity-100">
      <span className={fontFiraCode}>Go</span>
    </button>
  </label>
);

export function Sidebar() {
  const { workspaces, createFolder, i } = useSidebar();
  const { size, resizing, handler } = useResize();
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div className="flex group/sidebar relative">
      <div
        className={`flex flex-col h-screen bg-neutral-100 bg-opacity-60 dark:bg-neutral-950 overflow-visible relative`}
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

        <div className="w-full h-1 bg-zinc-200 bg-opacity-60 dark:bg-zinc-900"/>

        <div className="flex w-full p-2 flex-col gap-2">
          <Link
          href={'/home'}
          data-selected={!!pathname.startsWith('/home')}
          className="flex items-center gap-2 text-black dark:text-zinc-300 opacity-70 hover:opacity-100 data-[selected=true]:dark:text-indigo-500 data-[selected=true]:opacity-100">
            <FaHome size={16}/>
            <span className={fontFiraCode}>Home</span>
          </Link>

          <Link
          href={'#'}
          className="flex items-center gap-2 text-black dark:text-zinc-300 opacity-70 hover:opacity-100">
            <BiSearch size={16}/>
            <span className={fontFiraCode}>Search</span>
          </Link>
        </div>

        <div className="w-full h-1 bg-zinc-200 bg-opacity-60 dark:bg-zinc-900"/>

        <div className={`${fontFiraCode} px-2 flex justify-between mt-1`}>
          <div className="text-zinc-400">Workspaces</div>
          <div className="text-zinc-500">
            <MdSpaceDashboard />
          </div>
        </div>

        <section className="gap-4 pb-5 px-2 overflow-hidden flex flex-col relative ">
          <div>
            <button
              onClick={() => createFolder()}
              className="w-auto gap-3 px-3 h-8 flex items-center bg-white dark:bg-zinc-800 dark:text-zinc-200 dark:hover:text-white justify-center bg-transparent border border-zinc-700 border-dashed text-gray-500 rounded opacity-90 hover:opacity-100"
            >
              <HiFolderPlus />
              <span className="text-sm capitalize">fold</span>
            </button>
          </div>
          <div className="flex-1 flex flex-col h-full max-w-auto rounded-lg bg-white dark:bg-zinc-900 p-2 overflow-auto scroll-default shadow-md dark:shadow-black dark:border dark:border-zinc-800 dark:border-opacity-50 dark:bg-opacity-70">
            {!!workspaces &&
              workspaces?.[0]?.name &&
              workspaces?.map(({ id, name, code, workspaces, cards }, index: number) => {
                return (
                  <WorkspaceLink
                    key={index}
                    {...{ id, name, code, workspaces, cards }}
                  />
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
