"use client";

import { api } from "@/api";
import { ICard } from "@/interfaces/ICard";
import { IWorkspace } from "@/interfaces/IWorkspace";
import { queryClient } from "@/providers/query-client";
import { useQuery } from "@tanstack/react-query";
import { useParams, useSearchParams } from "next/navigation";

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
  const { id } = useParams();

  const { data: latestCard } = useQuery<ICard>({
    queryKey: ["card", "latest", id],
    queryFn: async () => {
      return (await api.get(`/cards/latest/${id}`)).data;
    },
  });

  return {
    latestCard,
  };
}
