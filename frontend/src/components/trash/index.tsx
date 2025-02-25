"use client";

import { api } from "@/api";
import { fontFiraCode } from "@/fonts";
import { IWorkspace } from "@/interfaces/IWorkspace";
import { queryClient } from "@/providers/query-client";
import { useQuery } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import { IoClose } from "react-icons/io5";
import { RxReset } from "react-icons/rx";
import { toast } from "react-toastify";
import { Modal } from "../modal-template";

const minutes = 1000 * 10;

const useTrash = () => {
  const { data: workspaces } = useQuery<IWorkspace[]>({
    queryFn: async () => (await api.get("/workspaces/disabled")).data,
    queryKey: ["workspaces", "trash"],
    refetchInterval: minutes,
  });

  const deleteWorkspace = async (workspaceId: string) => {
    const deleted = await api.delete(`/workspaces/${workspaceId}`);

    await queryClient.setQueryData(
      ["workspaces", "trash"],
      (prevWorksapces: IWorkspace[]) => {
        return [...prevWorksapces?.filter((it) => it.id !== workspaceId)];
      }
    );

    if (!deleted.data.error) {
      toast.success("Deletado com sucesso!", {
        toastId: "toast delete",
      });
    } else {
      toast.error("Houve um erro ao tentar deletar!", {
        toastId: "toast delete",
      });
    }
  };

  const enable = async (id: string) => {
    const response = await api.put(`/workspaces/enable/${id}`);

    if (response.data.error) {
      toast.error("erro ao restaurar workspaces");
    }

    await queryClient.refetchQueries({
      queryKey: ["workspaces"],
    });
  };

  return {
    enable,
    deleteWorkspace,
    workspaces,
  };
};

export function Trash() {
  const { enable, workspaces, deleteWorkspace } = useTrash();

  return (
    <Modal.Container>
      <Modal.Header title="Lixeira" />
      <div className="flex p-5 flex-col gap-2 bg-white dark:bg-zinc-900">
        <InputSearch />

        <section className="flex flex-col gap-1 h-[12rem] relative overflow-auto border dark:bg-zinc-800 dark:shadow dark:shadow-zinc-950 dark:bg-opacity-40 dark:border-transparent rounded-xl p-1">
          <AnimatePresence mode="sync">
            {!workspaces?.length && (
              <motion.div
                animate={{ scale: 1, opacity: 1 }}
                className="text-zinc-500 flex flex-1 w-full h-full top-0 left-0 items-center justify-center text-center absolute"
              >
                Nenhum item na lixeira
              </motion.div>
            )}

            {workspaces?.map((workspace: IWorkspace) => {
              const quantityOfWorkspace = workspace?.workspaces?.length || 0;
              const quantityOfCards = workspace?.cards?.length || 0;
              const total = quantityOfWorkspace + quantityOfCards;
              return (
                <motion.div
                  exit={{ scale: 0.8, opacity: 0 }}
                  transition={{ type: "spring", duration: 0.4 }}
                  key={workspace.id}
                  className="rounded flex justify-between items-center p-1 "
                >
                  <div className="cursor-default flex gap-2 text-zinc-500 dark:text-zinc-200 items-center">
                    <span className="font-semibold px-2">
                      {workspace?.name}
                    </span>
                    <div className="flex p-1 px-2 opacity-50 bg-zinc-100 shadow dark:bg-zinc-700 rounded">
                      <div className="font-semibold text-xs">
                        {total} documents
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => deleteWorkspace(workspace.id)}
                      className="w-8 h-8 bg-zinc-100 dark:bg-zinc-800 border dark:border-zinc-800 text-zinc-500 grid place-items-center rounded opacity-90 hover:opacity-100"
                    >
                      <IoClose />
                    </button>
                    <button
                      type="button"
                      onClick={() => enable(workspace.id)}
                      className="w-12 h-8 bg-indigo-600 rounded-md text-white grid place-items-center opacity-90 hover:opacity-100"
                    >
                      <RxReset size={16} />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </section>
      </div>
    </Modal.Container>
  );
}

const InputSearch = () => (
  <label
    htmlFor="search"
    className="border dark:border-zinc-800 dark:bg-opacity-60 rounded-md dark:bg-zinc-800 w-full flex items-center focus-within:ring-2 ring-indigo-400 dark:ring-indigo-600 ring-offset-1 transition-all ring-offset-white dark:ring-offset-zinc-900 bg-white dark:bg-transparent"
  >
    <input
      type="text"
      id="search"
      placeholder="my workspace..."
      className="flex bg-transparent px-2 font-semibold outline-none text-zinc-500 dark:text-zinc-300 w-full p-2 dark:placeholder:text-zinc-300 placeholder:text-zinc-400 placeholder:text-sm"
    />
    <button className="flex px-4 text-white bg-indigo-600 rounded mr-2 text-xs p-1 opacity-90 hover:opacity-100">
      <span className={fontFiraCode}>Go</span>
    </button>
  </label>
);
