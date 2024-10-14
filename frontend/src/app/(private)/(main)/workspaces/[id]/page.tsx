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

      <div className="absolute top-0 left-0 overflow-hidden flex items-center flex-1 w-full h-full z-[0]">
        <div className="grid-image w-full h-full"></div>
      </div>

      <header className="flex w-full px-5 z-10">
        <div className="flex gap-4 justify-between items-center w-full max-w-main mx-auto my-4">
          <div className="flex gap-2 items-center">
            <h1
              className={`${fontFiraCode}  text-lg text-zinc-600 dark:text-zinc-200`}
            >
              Workspace{" "}
              <b className="text-zinc-700 dark:text-white">{workspace?.name}</b>
            </h1>
          </div>
          <div className="flex gap-2 items-center rounded-md">
            <button
              onClick={() => router.push("?mdw=rename")}
              className="opacity-80 hover:opacity-100 items-center flex gap-2 px-3 h-8 rounded bg-zinc-100 dark:bg-black shadow dark:shadow-black border-l dark:border-zinc-800/90"
            >
              <MdOutlineDriveFileRenameOutline />
              <span className={`${fontFiraCode}`}>Edit</span>
            </button>

            <Settings />
          </div>
        </div>
      </header>

      <section className="flex flex-col gap-10 pb-20 px-5 z-10">
        <Dashboards workspace={workspace} />

        <Files workspace={workspace} />

        <AnimatePresence>
          {modal === "delete" && <DeleteWorkspace id={id} name={name} />}
          {modal === "rename" && <RenameWorkspace id={id} name={name} />}
        </AnimatePresence>
      </section>
    </div>
  );
}
