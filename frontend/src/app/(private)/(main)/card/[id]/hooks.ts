import { api } from "@/api";
import { ICard } from "@/interfaces/ICard";
import { IWorkspace } from "@/interfaces/IWorkspace";
import { queryClient } from "@/providers/query-client";
import { BlockNoteEditor } from "@blocknote/core";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { ChangeEvent, useEffect, useState } from "react";
import { toast } from "react-toastify";

type useUpdateTitleCardProps = {
  card: ICard | undefined | null;
};

type useUpdateContentCardProps = {
  editor?: BlockNoteEditor | null;
  card?: ICard | undefined | null;
};

function getRandomNumber(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

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

export const useUpdateTitleCard = ({ card }: useUpdateTitleCardProps) => {
  const [title, setTitle] = useState<string | null>(card?.title || null);

  useEffect(() => {
    return () => {
      queryClient.invalidateQueries({
        queryKey: ["card", "latest", card?.workspaceId],
      });
    };
  }, [card?.workspaceId]);

  const onChangeTitle = async (
    e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    const value = e.currentTarget.value || "";

    const cardId = card?.id || null;
    const workspaceId = card?.workspaceId || null;

    if (!cardId || !workspaceId) {
      toast.error("Houve um erro, tente novamente mais tarde!");
      return;
    }

    const element = window.document.getElementById(cardId);
    if (element) element.innerHTML = value;

    setTitle(value);

    await Promise.all([
      api.put(`/cards/${cardId}`, {
        title: value,
      }),

      queryClient.setQueryData(["workspaces"], (workspaces: IWorkspace[]) => {
        const updated = updateCardInWorkspace(workspaces, cardId, {
          title: value,
        });

        return updated;
      }),

      queryClient.setQueryData(
        ["workspaces", card?.workspaceId],
        (workspace: IWorkspace) => {
          if (!workspace) return;

          const cards = workspace.cards || null;
          const newCards = cards?.map((cardCurrent) => {
            if (cardCurrent.id === cardId) {
              return {
                ...card,
                title: value,
              };
            }

            return cardCurrent;
          });

          return {
            ...workspace,
            cards: newCards,
          };
        }
      ),

      queryClient.setQueryData(["card", cardId], (prevCard: ICard) => {
        return {
          ...prevCard,
          title: value,
        };
      }),
    ]);
  };

  return {
    title,
    onChangeTitle,
  };
};

export function useCard(cardId: string) {
  const { data: card, isLoading } = useQuery<ICard>({
    queryKey: ["card", cardId],
    queryFn: async () => (await api.get(`/cards/${cardId}`)).data,
  });

  return {
    isLoading,
    card,
  };
}

export function useUpdateContentCard(props: useUpdateContentCardProps) {
  
  const { card, editor } = props;
  const content = card?.content || null;
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);
  const [latest, setLatest] = useState<string | null>(content || null);
  const [loading, setLoading] = useState<boolean>(false);

  const params = useParams();
  const cardId = params.id || null;

  const save = async (content: string) => {
    if (!card || !content) return;

    setLoading(false);
    setLatest(content);

    await Promise.all([
      api.put(`/cards/${params.id}`, {
        content,
      }),

      queryClient.setQueryData(
        ["card", "latest", card?.workspaceId],
        () => card
      ),
    ]);
  };

  const updateContent = async () => {
    const html = editor?.document ? JSON.stringify(editor.document) : null;

    setLoading(false);

    if (content) setLatest(content);
    if (timeoutId) clearTimeout(timeoutId);
    if (latest === html || !content || !latest) return;

    const min = 1;
    const max = 3;
    const timeInSecounds = getRandomNumber(min, max) * 1000;

    setLoading(true);
    const idTimeout = setTimeout(() => {
      if (!!html && !!cardId) save(html);
    }, timeInSecounds);
    setTimeoutId(idTimeout);

    return () => {
      clearTimeout(idTimeout);
    };
  };

  useEffect(() => {
    const handle = (e: BeforeUnloadEvent) => {
      if (loading) {
        e.preventDefault();
        return "";
      }
    };

    window.addEventListener("beforeunload", handle, { capture: true });

    return () => {
      window.removeEventListener("beforeunload", handle, { capture: true });
    };
  }, [loading]);

  useEffect(() => {
    return () => {
      const html = editor?.document ? JSON.stringify(editor?.document) : null;
      if (!html) return;

      setLoading(false);
      save(html);

      queryClient.invalidateQueries({
        queryKey: ["card", "latest", card?.workspaceId],
      });

      queryClient.setQueryData(["card", cardId], (prevCard: ICard) => {
        return {
          ...prevCard,
          content: html,
        };
      });
    };
  }, [editor, card?.workspaceId]);

  return { loading, updateContent };
}
