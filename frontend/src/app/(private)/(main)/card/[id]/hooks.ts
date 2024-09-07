import { api } from "@/api";
import { ICard } from "@/interfaces/ICard";
import { IWorkspace } from "@/interfaces/IWorkspace";
import { queryClient } from "@/providers/query-client";
import { useQuery } from "@tanstack/react-query";
import { Editor } from "@tiptap/react";
import { useParams } from "next/navigation";
import { ChangeEvent, useEffect, useRef, useState } from "react";

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

export const useUpdateTitleCard = (
  card: ICard | undefined | null,
  isLoading: boolean
) => {
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

    api.put(`/cards/${cardId}`, {
      title: value,
    });

    await Promise.all([
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

  // useEffect(() => {
  //   if (refToHeader?.current) {
  //     const yPosition = refToHeader?.current?.g;
  //     console.log(yPosition);
  //   }
  // }, [refToHeader]);

  return {
    refToHeader,
    isLoading,
    onScroll,
    fixed,
    card,
  };
}

export function useUpdateContentCard(
  editor?: Editor | null,
  content?: string | undefined | null
) {
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);
  const [last, setLast] = useState<string | null>(content || null);
  const [loading, setLoading] = useState<boolean>(false);

  const params = useParams();
  const cardId = params.id || null;

  const save = async (content: string) => {
    await api.put(`/cards/${params.id}`, {
      content,
    });
  };

  useEffect(() => {
    const html = editor?.getHTML() || null;

    setLoading(false);

    if (content) setLast(content);

    if (last === html || !content || !last) return;

    if (timeoutId) clearTimeout(timeoutId);

    const min = 1,
      max = 3;
    const timeInSecounds = getRandomNumber(min, max) * 1000;

    setLoading(true);
    const idTimeout = setTimeout(() => {
      if (!html || !cardId) return;
      setLoading(false);
      setLast(html);
      save(html);
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
