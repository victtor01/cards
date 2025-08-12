"use client";

import { useSidebar } from "@/hooks/use-sidebar";
import { BiMenu } from "react-icons/bi";
import { WorkspaceLink } from "../sidebar/workspace";
import { useState } from "react";
import { UserComponent } from "../sidebar/user-component";
import { IoClose } from "react-icons/io5";
import { ButtonToCreateFold, UtilsSidebar } from "../sidebar/main-sidebar";

export default function MenuButton() {
  const { workspaces, i } = useSidebar();
  const [open, setOpen] = useState<boolean>(false);

  return (
    <div
      data-isopen={open}
      className="fixed top-0 pointer-events-none right-0 data-[isopen=true]:bg-indigo-50/50 flex w-full h-screen z-40 gap-2 lg:hidden
      data-[isopen=true]:pointer-events-auto data-[isopen=true]:dark:bg-zinc-950/80 data-[isopen=true]:dark:border-r"
    >
      {open && (
        <div className="w-full bg-white dark:bg-zinc-950 flex-col flex h-screen overflow-auto relative dark:border-r dark:border-zinc-700 dark:shadow-xl dark:shadow-black">
          <div className="p-4">
            <UserComponent photoUrl={i?.photo} />
          </div>
          <div className="w-full h-[1px] rounded-full bg-zinc-200 bg-opacity-60 dark:bg-zinc-900" />
          <div className="flex p-3">
            <UtilsSidebar />
          </div>
          <div className="w-full h-[1px] bg-zinc-200 rounded-full bg-opacity-60 dark:bg-zinc-900" />
          <div className="flex flex-col p-2">
            <ButtonToCreateFold />
            <span className="flex my-2"/>
            {workspaces?.[0]?.name &&
              workspaces?.map((workspace, index: number) => {
                return <WorkspaceLink key={index} {...workspace} />;
              })}
          </div>
        </div>
      )}
      <div className="p-4 pr-5 mt-12">
        <button
          type="button"
          onClick={() => setOpen((open) => !open)}
          className="w-12 h-12 bg-gray-100 dark:bg-zinc-900 pointer-events-auto shadow rounded-full grid place-items-center "
        >
          {!open && <BiMenu />}
          {open && <IoClose />}
        </button>
      </div>
    </div>
  );
}
