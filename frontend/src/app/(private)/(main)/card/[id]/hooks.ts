import { api } from "@/api";
import workspaces from "@/components/workspaces";
import { ICard } from "@/interfaces/ICard";
import { Workspace } from "@/interfaces/IWorkspace";
import { queryClient } from "@/providers/query-client";
import { useQuery } from "@tanstack/react-query";
import { Editor } from "@tiptap/react";
import { all } from "axios";
import { log } from "console";
import { get } from "http";
import { useParams } from "next/navigation";
import { ChangeEvent, useEffect, useState } from "react";
import { BiArrowBack } from "react-icons/bi";
import { map } from "zod";

function getRandomNumber(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const updateCardInWorkspace = (
  nodes: Workspace[],
  cardId: string,
  newCardData: Partial<ICard>
): Workspace[] => {
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

export function useCard(cardId: string) {
  const [title, setTitle] = useState<string | null>(null);

  const { data: card, isLoading } = useQuery<ICard>({
    queryKey: ["card", cardId],
    queryFn: async () => (await api.get(`/cards/${cardId}`)).data,
  });

  useEffect(() => {
    if (!isLoading) {
      setTitle(card?.title || "");
    }
  }, [isLoading]);

  const onChangeName = async (
    e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    const value = e.currentTarget.value || "";

    const element = window.document.getElementById(cardId);
    if (element) element.innerHTML = value;

    setTitle(value);

    api.put(`/cards/${cardId}`, {
      title: value,
    });

    await Promise.all([
      queryClient.setQueryData(["workspaces"], (workspaces: Workspace[]) => {
        const updated = updateCardInWorkspace(workspaces, cardId, {
          title: value,
        });

        return updated;
      }),
      queryClient.setQueryData(
        ["workspaces", card?.workspaceId],
        (workspace: Workspace) => {
          if (!workspace) return;

          const cards = workspace.cards || null;
          const newCards = cards?.map((cardCurrent) => {
            if (cardCurrent.id === card?.id) {
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
    onChangeName,
    title,
    isLoading,
    card,
  };
}

export function useUpdateCard(
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

    if (content) setLast(content);
    if (last === html) return;
    if (!content || !last) return;
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
