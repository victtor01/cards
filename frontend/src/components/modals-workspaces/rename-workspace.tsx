import { useForm } from "react-hook-form";
import { Modal } from "../modal-template";
import { useRouter } from "next/navigation";
import { api } from "@/api";
import { queryClient } from "@/providers/query-client";
import { IWorkspace } from "@/interfaces/IWorkspace";
import { toast } from "react-toastify";

interface RenameWorkspaceProps {
  id: string;
  name: string;
}

const useRenameWorkspace = (props: RenameWorkspaceProps) => {
  const router = useRouter();
  const { id, name } = props;

  const form = useForm({
    defaultValues: {
      name,
    },
  });

  const rename = async (data: { name: string }) => {
    const { name } = data;

    const res = await api.put(`/workspaces/${id}`, {
      name,
    });

    await queryClient.setQueryData(["workspaces", id], (data: IWorkspace) => {
      return {
        ...data,
        name,
      };
    });

    toast.success("Atualizado com sucesso!");
    router.push("?");
  };

  return {
    form,
    rename,
  };
};

export function RenameWorkspace({ id, name }: RenameWorkspaceProps) {
  const { form, rename } = useRenameWorkspace({ id, name });
  const { register, handleSubmit } = form;
  const router = useRouter();

  const value = form.watch("name");

  return (
    <Modal title="Renomeie o seu espaço de trabalho">
      <form
        className="w-full p-6 bg-white dark:bg-transparent"
        onSubmit={handleSubmit(rename)}
      >
        <label htmlFor="name" className="w-full grid gap-3">
          <span className="font-semibold text-zinc-600 dark:text-zinc-200">
            Nome *
          </span>
          <input
            id="name"
            {...register("name")}
            placeholder="Este é um exemplo..."
            className="w-full placeholder:text-zinc-400 bg-zinc-50 dark:bg-zinc-800 dark:placeholder:text-zinc-700 p-2 px-3 rounded outline-none border dark:border-transparent text-zinc-600 font-semibold dark:text-zinc-200 focus:ring-2 ring-indigo-600 ring-opacity-80 transition-shadow"
          />
        </label>

        <footer className="w-full flex justify-between mt-10">
          <button
            type="button"
            onClick={() => router.push("?")}
            className="p-2 px-4 text-white bg-rose-600 rounded opacity-90 hover:opacity-100"
          >
            Cancelar
          </button>

          <button
            type="submit"
            data-accept={!!value}
            className="p-2 px-4 text-white bg-indigo-600 rounded opacity-70 dark:opacity-40 data-[accept=true]:opacity-100 dark:data-[accept=true]:opacity-100"
          >
            Concluido.
          </button>
        </footer>
      </form>
    </Modal>
  );
}
