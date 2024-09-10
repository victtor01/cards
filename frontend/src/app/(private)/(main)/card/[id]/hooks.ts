import { api } from "@/api";
import { ICard } from "@/interfaces/ICard";
import { IWorkspace } from "@/interfaces/IWorkspace";
import { queryClient } from "@/providers/query-client";
import { useQuery } from "@tanstack/react-query";
import { Editor } from "@tiptap/react";
import { useParams } from "next/navigation";
import { ChangeEvent, useEffect, useRef, useState } from "react";

type useUpdateTitleCardProps = {
  card: ICard | undefined | null;
  isLoading: boolean;
};

type useUpdateContentCardProps = {
  editor?: Editor | null;
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

export const useUpdateTitleCard = ({
  card,
  isLoading,
}: useUpdateTitleCardProps) => {
  const [title, setTitle] = useState<string | null>(null);

  const cardId = card?.id || null;

  useEffect(() => {
    if (!isLoading) {
      setTitle(card?.title || "");
    }
  }, [isLoading]);

  const onChangeTitle = async (
    e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    const value = e.currentTarget.value || "";

    if (!cardId) return;

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
        console.log(title);
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

  const [fixed, setFixed] = useState<boolean>(true);

  const refToHeader = useRef<HTMLDivElement | null>(null);

  const onScroll = () => {
    setFixed(() => !!(refToHeader.current?.scrollTop === 0));
  };

  return {
    refToHeader,
    isLoading,
    onScroll,
    fixed,
    card,
  };
}

export function useUpdateContentCard({
  card,
  editor,
}: useUpdateContentCardProps) {
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

  useEffect(() => {
    const html = editor?.getHTML() || null;
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
  }, [editor?.getHTML(), content]);

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
      const html = editor?.getHTML() || null;

      if (!!html) {
        setLoading(false);
        save(html);

        queryClient.setQueryData(["card", cardId], (prevCard: ICard) => {
          return {
            ...prevCard,
            content: html,
          };
        });
      }
    };
  }, [editor]);

  return { loading };
}
