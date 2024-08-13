"use client";

import { fontFiraCode } from "@/fonts";
import { useWorkspace } from "./hooks";
import { GoPlus } from "react-icons/go";
import { IoSettings } from "react-icons/io5";
import { Dashboards } from "./dashboards";
import Link from "next/link";

type WorkspaceProps = {
  params: {
    code: string;
  };
};

export default function Workspace({ params }: WorkspaceProps) {
  const { workspace, isLoading } = useWorkspace(params.code);
  const { code } = params;

  if (isLoading) {
    return <>Loading...</>;
  }

  return (
    <div className="w-full flex flex-col flex-1">
      <div className="w-full flex-1 flex flex-col mt-10">
        <div className="w-full flex flex-col gap-2 p-2 px-4">
          <header className="flex gap-2 justify-between items-center w-full max-w-main mx-auto">
            <div>
              <h1
                className={`${fontFiraCode} text-lg text-zinc-600 dark:text-zinc-200`}
              >
                Workspace{" "}
                <b className="text-zinc-700 dark:text-white">
                  {workspace?.name}
                </b>
              </h1>
            </div>
            <div className="flex gap-2 items-center">
              <Link
                href={`/workspaces/${code}/create`}
                className="text-zinc-400 hover:text-white text-lg"
              >
                <IoSettings size={20} />
              </Link>
              <Link
                href={`/workspaces/${code}/create`}
                className="text-zinc-400 hover:text-white text-lg"
              >
                <GoPlus size={24} />
              </Link>
            </div>
          </header>

          {workspace && <Dashboards {...{ workspace }} />}
        </div>
      </div>
    </div>
  );
}
