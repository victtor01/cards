import { api } from "@/api";
import { queryClient } from "@/providers/query-client";

export function useActionsWorkspaces() {
  const createFolder = async (parentId: string | null = null) => {
    await api.post("/workspaces", { name: "new folder", parentId });

    await queryClient.invalidateQueries({
      queryKey: ["workspaces"],
    });
  };

  const createFile = async (workspaceId: string) => {
    if (!workspaceId) return;

    await api.post("/cards", { title: "new file", workspaceId });
    await queryClient.invalidateQueries({
      queryKey: ["workspaces"],
    });
  };

  return {
    createFile,
    createFolder,
  };
}
