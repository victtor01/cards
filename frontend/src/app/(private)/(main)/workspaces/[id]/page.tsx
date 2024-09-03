"use client";

import { fontFiraCode } from "@/fonts";
import { useWorkspace } from "./hooks";
import { Dashboards } from "./dashboards";
import { Background } from "./background";
import { GoPlus } from "react-icons/go";
import { Files } from "./files";
import Link from "next/link";
import { Settings } from "@/components/settings-workspace";
import { AnimatePresence } from "framer-motion";
import { DeleteWorkspace } from "@/components/modals-workspaces/delete-workspace";
import { MdOutlineDriveFileRenameOutline } from "react-icons/md";
import { RenameWorkspace } from "@/components/modals-workspaces/rename-workspace";
import { useRouter } from "next/navigation";

type WorkspaceProps = {
  params: {
    id: string;
  };
};

export default function Workspace({ params }: WorkspaceProps) {
  const { workspace, modal, isLoading } = useWorkspace(params.id);
  const router = useRouter();

  if (isLoading) {
    return <>Loading...</>;
  }

  if (!workspace?.id || !workspace?.name) {
    throw new Error("workspace not found!");
  }

  const { id, name } = workspace;

  return (
    <div className="w-full flex flex-col flex-1 gap-6">
      <Background photoUrl={workspace?.background} workspaceId={workspace.id} />

      <div className="w-full h-auto px-3">
        <header className="flex gap-4 justify-between items-center w-full max-w-main mx-auto my-4">
          <div className="flex gap-2 items-center">
            <h1
              className={`${fontFiraCode} text-lg text-zinc-600 dark:text-zinc-200`}
            >
              Workspace{" "}
              <b className="text-zinc-700 dark:text-white">{workspace?.name}</b>
            </h1>
            <button
              onClick={() => router.push("?mdw=rename")}
              className="opacity-60 hover:opacity-100 grid place-items-center w-8 h-8 rounded hover:bg-zinc-100 dark:hover:bg-zinc-900"
            >
              <MdOutlineDriveFileRenameOutline />
            </button>
          </div>
          <button className="flex gap-2 items-center">
            <Settings />
          </button>
        </header>

        {!!workspace && <Dashboards workspace={workspace} />}

        {!!workspace && <Files workspace={workspace} />}

        <AnimatePresence>
          {modal === "delete" && <DeleteWorkspace {...{ id, name }} />}
        </AnimatePresence>

        <AnimatePresence>
          {modal === "rename" && <RenameWorkspace {...{ id, name }} />}
        </AnimatePresence>
      </div>
    </div>
  );
}
