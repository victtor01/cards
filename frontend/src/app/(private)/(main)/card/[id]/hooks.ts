import { api } from "@/api";
import { ICard } from "@/interfaces/ICard";
import { queryClient } from "@/providers/query-client";
import { BlockNoteEditor, BlockSchemaFromSpecs } from "@blocknote/core";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { getRandomNumber } from "./utils-cards";

type useUpdateContentCardProps = {
  editor?: BlockNoteEditor<BlockSchemaFromSpecs<any>> | null;
  card?: ICard | undefined | null;
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

  const startLoading = () => setLoading(true);
  const stopLoading = () => setLoading(false);

  const save = async (content: string | null) => {
    if (!card || !content) return;

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

  const saveChanges = async (html: string | null) => {
    try {
      await save(html);
      setLatest(html);
    } catch (error) {
      toast.error("Houve um erro ao tentar atualizar arquivo!");
    } finally {
      stopLoading();
    }
  };

  const updateContent = async () => {
    stopLoading();
    const html = editor?.document ? JSON.stringify(editor.document) : null;
    if (timeoutId) clearTimeout(timeoutId);
    if (latest === html) return;

    startLoading();
    const MIN_RANDOM = 1;
    const MAX_RANDOM = 3;
    const timeInSecounds = getRandomNumber(MIN_RANDOM, MAX_RANDOM) * 1000;
    const idTimeout = setTimeout(() => saveChanges(html), timeInSecounds);
    setTimeoutId(idTimeout);
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

      stopLoading();
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
