"use client";

import { DeleteWorkspace } from "@/components/modals-workspaces/delete-workspace";
import { RenameWorkspace } from "@/components/modals-workspaces/rename-workspace";
import { Settings } from "@/components/settings-workspace";
import { fontFiraCode } from "@/fonts";
import { AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { MdOutlineDriveFileRenameOutline } from "react-icons/md";
import { Background } from "./background";
import { Dashboards } from "./dashboards";
import { Files } from "./files";
import { useWorkspace } from "./hooks";
import { warn } from "console";

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
    <div className="w-full flex flex-col flex-1 gap-6 relative">
      <Background photoUrl={workspace?.background} workspaceId={workspace.id} />

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
        <div className="flex gap-2 items-center">
          <Settings />
        </div>
      </header>

      {!!workspace && (
        <section className="flex flex-col gap-10 pb-20">
          <Dashboards workspace={workspace} />
          <Files workspace={workspace} />

          <AnimatePresence>
            {modal === "delete" && <DeleteWorkspace {...{ id, name }} />}
            {modal === "rename" && <RenameWorkspace {...{ id, name }} />}
          </AnimatePresence>
        </section>
      )}
    </div>
  );
}
