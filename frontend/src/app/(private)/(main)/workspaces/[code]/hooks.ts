import { api } from "@/api";
import { Workspace } from "@/interfaces/IWorkspace";
import { GenerateSoundClick } from "@/utils/generate-sound-click";
import { useQuery } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";

export function useWorkspace(workspaceId: string) {
  const { data: workspace } = useQuery<Workspace>({
    queryKey: ["workspaces", workspaceId],
    queryFn: async () => (await api.get(`/workspaces/${workspaceId}`)).data,
  });
  
  return {
    workspace
  }
}

export function useDashboards() {
  const router = useRouter();
  const { code } = useParams();

  const redirectToCreate = () => {
    GenerateSoundClick();
    router.push(`/workspaces/${code}/create`)
  }

  return {
    redirectToCreate
  }
}