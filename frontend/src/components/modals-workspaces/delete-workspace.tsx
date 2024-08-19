import { api } from "@/api";
import { Modal } from "../modal";
import { queryClient } from "@/providers/query-client";
import { useRouter } from "next/navigation";

type DeleteWorkspaceProps = {
  id: string;
  name: string;
};

const useDeleteWorkspace = () => {
  const router = useRouter();

  const handleDelete = async (id: string) => {
    await api.delete(`/workspaces/${id}`);

    router.push("/home");

    await queryClient.resetQueries({
      queryKey: ["workspaces"],
    });
  };

  return {
    handleDelete,
  };
};

export function DeleteWorkspace({ id, name }: DeleteWorkspaceProps) {
  const { handleDelete } = useDeleteWorkspace();

  return (
    <Modal title="delete workspace">
      <section className="flex flex-col p-6 gap-10">
        <p className="text-lg">
          Are you sure you want to <span className="text-rose-600">delete</span>{" "}
          the workspace '{name}' ?
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
    </Modal>
  );
}
