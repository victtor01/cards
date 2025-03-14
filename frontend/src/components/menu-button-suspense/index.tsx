"use client";

import { useSidebar } from "@/hooks/use-sidebar";
import { BiMenu } from "react-icons/bi";
import { WorkspaceLink } from "../sidebar/workspace";
import { useState } from "react";

export default function MenuButton() {
  const { workspaces, i } = useSidebar();
  const [open, setOpen] = useState<boolean>(false);

  return (
    <div
      data-isopen={open}
      className="fixed top-0 pointer-events-none right-0 data-[isopen=true]:bg-indigo-50/50 flex w-full h-screen z-40 gap-2 lg:hidden
      data-[isopen=true]:pointer-events-auto"
    >
      {open && (
        <div className="w-full p-2 bg-white h-screen overflow-auto">
          {workspaces?.[0]?.name &&
            workspaces?.map((workspace, index: number) => {
              return <WorkspaceLink key={index} {...workspace} />;
            })}
        </div>
      )}
      <div className="p-4 pr-7">
        <button
          type="button"
          onClick={() => setOpen((open) => !open)}
          className="w-12 h-12 bg-gray-100 pointer-events-auto shadow rounded-full grid place-items-center"
        >
          <BiMenu />
        </button>
      </div>
    </div>
  );
}
