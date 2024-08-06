"use client"

import { fontFiraCode } from "@/fonts";
import { useWorkspace } from "./hooks";

type WorkspaceProps = {
  params: {
    code: string
  }
}

export default function Workspace({ params }: WorkspaceProps) {
  const { workspace } = useWorkspace(params.code);

  return (
    <div className="w-full flex flex-col gap-2 p-2">
      <header className="flex gap-2">
        <h1 className={`${fontFiraCode} text-lg text-zinc-200`}>
          Workspace <b className="text-white">{workspace?.name}</b>
        </h1>
      </header>
    </div>
  );
}
