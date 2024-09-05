"use client";

import { api } from "@/api";
import { fontFiraCode } from "@/fonts";
import { IWorkspace } from "@/interfaces/IWorkspace";
import { useQuery } from "@tanstack/react-query";
import { RxReset } from "react-icons/rx";
import { Modal } from "../modal-template";
import { IoClose, IoTrash } from "react-icons/io5";

const minutes = 1000 * 10;

const useTrash = () => {
  const { data: workspaces } = useQuery<IWorkspace[]>({
    queryFn: async () => (await api.get("/workspaces/disabled")).data,
    queryKey: ["workspaces", "trash"],
    refetchInterval: minutes,
  });

  return {
    workspaces,
  };
};

export function Trash() {
  const { workspaces } = useTrash();

  return (
    <Modal title="Lixeira">
      <div className="flex p-5 flex-col gap-2 bg-white dark:bg-zinc-900">
        <InputSearch />

        <section className="flex flex-col gap-1">
          {!workspaces?.length && (
            <div className="text-zinc-500">Nenhum item na lixeira</div>
          )}

          {workspaces?.map((workspace) => {
            return (
              <div className="rounded flex justify-between items-center p-1">
                <div className="cursor-default">
                  <span className="text-zinc-500 dark:text-zinc-200 font-semibold px-2">
                    {workspace?.name}
                  </span>
                </div>
                <div className="flex gap-2">
                  <button className="w-8 h-8 bg-zinc-100 dark:bg-zinc-950 border dark:border-zinc-800 text-zinc-500 grid place-items-center rounded opacity-90 hover:opacity-100">
                    <IoClose />
                  </button>
                  <button className="w-12 h-8 bg-indigo-600 rounded text-white grid place-items-center opacity-90 hover:opacity-100">
                    <RxReset size={16} />
                  </button>
                </div>
              </div>
            );
          })}
        </section>
      </div>
    </Modal>
  );
}

const InputSearch = () => (
  <label
    htmlFor="search"
    className="border dark:border-zinc-800 rounded-md dark:bg-zinc-800 w-full flex items-center focus-within:ring-2 ring-indigo-400 dark:ring-indigo-600 ring-offset-1 transition-all ring-offset-white dark:ring-offset-zinc-900 bg-white dark:bg-transparent"
  >
    <input
      type="text"
      id="search"
      placeholder="my workspace..."
      className="flex bg-transparent px-3 font-semibold outline-none text-zinc-500 dark:text-zinc-300 w-full p-2 dark:placeholder:text-zinc-300 placeholder:text-zinc-400 placeholder:text-sm"
    />
    <button className="flex px-4 text-white bg-indigo-600 rounded mr-1 text-xs p-1 opacity-90 hover:opacity-100">
      <span className={fontFiraCode}>Go</span>
    </button>
  </label>
);
