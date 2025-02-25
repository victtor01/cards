import { api } from "@/api";
import { queryClient } from "@/providers/query-client";
import { useRouter } from "next/navigation";
import { Modal } from "../modal-template";
import { toast } from "react-toastify";

type DeleteWorkspaceProps = {
  id: string;
  name: string;
};

const useDeleteWorkspace = () => {
  const router = useRouter();

  const handleDelete = async (id: string) => {
    const deleted = api.put(`/workspaces/disable/${id}`);
    await toast.promise(deleted, {
      success: "Deletado com sucesso!",
      error: "Houve um erro ao excluir!",
      pending: "Deletando...",
    });
    await queryClient.invalidateQueries({
      queryKey: ["workspaces"],
    });

    router.push("/home");
  };

  return {
    handleDelete,
  };
};

export function DeleteWorkspace({ id, name }: DeleteWorkspaceProps) {
  const { handleDelete } = useDeleteWorkspace();

  return (
    <Modal.Container>
      <Modal.Header title="delete workspace" />
      <section className="flex flex-col p-6 gap-10">
        <p className="text-lg">
          Are you sure you want to <span className="text-rose-600">delete</span>{" "}
          the workspace {name} ?
        </p>
        <footer className="w-full">
          <button
            onClick={() => handleDelete(id)}
            type="button"
            className="p-2 bg-rose-700 text-white w-full opacity-90 hover:opacity-100 rounded"
          >
            Delete
          </button>
        </footer>
      </section>
    </Modal.Container>
  );
}
