import { api } from "@/api";
import { Workspace } from "@/interfaces/IWorkspace";
import { useQuery } from "@tanstack/react-query";

export function useWorkspace(workspaceId: string) {
  const { data: workspace } = useQuery<Workspace>({
    queryKey: ["workspaces", workspaceId],
    queryFn: async () => (await api.get(`/workspaces/${workspaceId}`)).data,
  });
  
  return {
    workspace
  }
}
