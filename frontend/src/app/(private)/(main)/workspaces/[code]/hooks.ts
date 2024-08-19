"use client";

import { api } from "@/api";
import { Workspace } from "@/interfaces/IWorkspace";
import { GenerateSoundClick } from "@/utils/generate-sound-click";
import { useQuery } from "@tanstack/react-query";
import { useParams, useRouter, useSearchParams } from "next/navigation";

type MDW = "delete" | null;

export function useWorkspace(workspaceId: string) {
  const { data: workspace, isLoading } = useQuery<Workspace>({
    queryKey: ["workspaces", workspaceId],
    queryFn: async () => (await api.get(`/workspaces/${workspaceId}`)).data,
  });
  
    const searchParams = useSearchParams();

  const modal = (searchParams.get("mdw") as MDW) || null;


  return {
    modal,
    workspace,
    isLoading
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