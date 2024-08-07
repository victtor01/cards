"use client";

import { fontFiraCode, fontValela } from "@/fonts";
import { useWorkspace } from "./hooks";
import { useParams } from "next/navigation";
import Link from "next/link";
import { BiPlus } from "react-icons/bi";

type WorkspaceProps = {
  params: {
    code: string;
  };
};

export default function Workspace({ params }: WorkspaceProps) {
  const { workspace } = useWorkspace(params.code);
  const { code } = useParams();

  return (
    <div className="w-full flex flex-col flex-1">
      <header className="p-1 border-b border-zinc-800 flex items-center justify-between">
        <div className="flex flex-1 px-2">
          <span className={`${fontValela} text-zinc-400`}>Workspace</span>
        </div>
        <div className="flex gap-3">
          <Link
            href={`/workspaces/${code}/create`}
            className="bg-zinc-800 bg-opacity-60 rounded p-1 flex items-center gap-2 px-2 capitalize border border-zinc-800 opacity-90 hover:opacity-100"
          >
            <BiPlus />
            <span>create</span>
          </Link>
        </div>
      </header>
      <div className="w-full flex-1 flex flex-col">
        <div className="w-full flex flex-col gap-2 p-2">
          <header className="flex gap-2">
            <h1 className={`${fontFiraCode} text-lg text-zinc-200`}>
              Workspace <b className="text-white">{workspace?.name}</b>
            </h1>
          </header>
        </div>
      </div>
    </div>
  );
}
