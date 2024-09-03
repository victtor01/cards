"use client";

import { api } from "@/api";
import { IWorkspace } from "@/interfaces/IWorkspace";
import { queryClient } from "@/providers/query-client";
import { GenerateSoundClick } from "@/utils/generate-sound-click";
import { useQuery } from "@tanstack/react-query";
import { useParams, useRouter, useSearchParams } from "next/navigation";

type MDW = "delete" | "rename" | null;

export function useWorkspace(workspaceId: string) {
  const { data: workspace, isLoading } = useQuery<IWorkspace>({
    queryKey: ["workspaces", workspaceId],
    queryFn: async () => (await api.get(`/workspaces/${workspaceId}`)).data,
  });

  const searchParams = useSearchParams();

  const modal = (searchParams.get("mdw") as MDW) || null;

  return {
    modal,
    workspace,
    isLoading,
  };
}

export function useBackground() {
  const params = useParams();

  const deleteBackground = async () => {
    const { id } = params;

    await api.delete(`/workspaces/background/id/${id}`);

    await queryClient.refetchQueries({
      queryKey: ["workspaces"],
    });
  };

  return {
    deleteBackground,
  };
}

export function useDashboards() {
  const router = useRouter();
  const { id } = useParams();

  const redirectToCreate = () => {
    GenerateSoundClick();
    router.push(`/workspaces/${id}/create`);
  };

  return {
    redirectToCreate,
  };
}
