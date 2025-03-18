import { api } from "@/api";
import { ICard } from "@/interfaces/ICard";
import { IWorkspace } from "@/interfaces/IWorkspace";
import { queryClient } from "@/providers/query-client";
import { QueryClient } from "@tanstack/react-query";
import { ChangeEvent, useEffect, useState } from "react";
import { toast } from "react-toastify";

type useUpdateTitleCardProps = {
  card: ICard | undefined | null;
};

const updateCardInWorkspace = (
  nodes: IWorkspace[],
  cardId: string,
  newCardData: Partial<ICard>
): IWorkspace[] => {
  return nodes.map((node) => {
    if (node.cards) {
      node.cards = node.cards.map((card) => {
        if (card.id === cardId) {
          return { ...card, ...newCardData };
        }
        return card;
      });
    }
    if (node.workspaces) {
      node.workspaces = updateCardInWorkspace(
        node.workspaces,
        cardId,
        newCardData
      );
    }
    return node;
  });
};

export const getCardAndWorkspaceId = (card: ICard) => {
  const cardId = card?.id || null;
  const workspaceId = card?.workspaceId || null;
  if (!cardId || !workspaceId) {
    toast.error("Houve um erro, tente novamente mais tarde!");
    return null;
  }
  return { cardId, workspaceId };
};

export const getValueInput = (
  e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
): string => e.currentTarget.value || "";

export const updateElementInnerHtml = (cardId: string, value: string) => {
  const element = window.document.getElementById(cardId);
  if (element) element.innerHTML = value;
};

export const useUpdateTitleCard = ({ card }: useUpdateTitleCardProps) => {
  const [title, setTitle] = useState<string | null>(card?.title || null);

  useEffect(() => {
    return () => {
      queryClient.invalidateQueries({
        queryKey: ["card", "latest", card?.workspaceId],
      });
    };
  }, [card?.workspaceId]);

  const updateCardTitle = (cardId: string, title: string) => {
    return api.put(`/cards/${cardId}`, { title });
  };

  const updateWorkspaceData = (
    queryClient: QueryClient,
    cardId: string,
    value: string
  ) => {
    return queryClient.setQueryData(
      ["workspaces"],
      (workspaces: IWorkspace[]) => {
        const updated = updateCardInWorkspace(workspaces, cardId, {
          title: value,
        });
        return updated;
      }
    );
  };

  const updateSpecificWorkspaceData = (
    queryClient: QueryClient,
    workspaceId: string,
    card: ICard,
    value: string
  ) => {
    queryClient.setQueryData(
      ["workspaces", workspaceId],
      (workspace: IWorkspace | undefined) => {
        if (!workspace) return;

        return {
          ...workspace,
          cards: workspace.cards?.map((cardCurrent) =>
            cardCurrent.id === card.id ? { ...card, title: value } : cardCurrent
          ),
        };
      }
    );
  };

  const updateCardData = (
    queryClient: QueryClient,
    cardId: string,
    value: string
  ) => {
    return queryClient.setQueryData(["card", cardId], (prevCard: ICard) => {
      return { ...prevCard, title: value };
    });
  };

  const onChangeTitle = async (
    e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    if (!card) return;

    const value = getValueInput(e);

    const cardIds = getCardAndWorkspaceId(card);
    if (!cardIds) return;

    const { cardId, workspaceId } = cardIds;

    updateElementInnerHtml(cardId, value);
    setTitle(value);

    if (value?.length > 0) {
      updateCardTitle(cardId, value);
    }

    await Promise.all([
      updateWorkspaceData(queryClient, cardId, value),
      updateSpecificWorkspaceData(queryClient, workspaceId, card, value),
      updateCardData(queryClient, cardId, value),
    ]);
  };

  return {
    title,
    onChangeTitle,
  };
};
