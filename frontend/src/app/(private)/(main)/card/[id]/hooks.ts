import { api } from "@/api";
import { ICard } from "@/interfaces/ICard";
import { queryClient } from "@/providers/query-client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { Editor } from "@tiptap/react";
import { log } from "console";
import { useParams } from "next/navigation";
import { title } from "process";
import { ChangeEvent, useEffect, useState } from "react";
import { get, useForm } from "react-hook-form";
import { infer, object, string, z } from "zod";

const schemaCreateCard = z.object({
  name: z.string(),
  content: z.string(),
});

type CreateCardProps = z.infer<typeof schemaCreateCard>;

export function useCreateCard(cardId: string) {
  const { data: card, isLoading } = useQuery<ICard>({
    queryKey: ["card", cardId],
    queryFn: async () => (await api.get(`/cards/${cardId}`)).data,
  });

  const onChangeName = async (e: ChangeEvent<HTMLTextAreaElement>) => {
    const { value } = e.currentTarget;

    await api.put(`/cards/${cardId}`, {
      title: value,
    });

    await queryClient.refetchQueries({
      queryKey: ["workspaces"],
    });
  };

  const form = useForm<CreateCardProps>({
    resolver: zodResolver(schemaCreateCard),
    defaultValues: {
      content: card?.content || "",
    },
  });

  return {
    onChangeName,
    isLoading,
    form,
    card,
  };
}

export function useUpdateCard(editor?: Editor | null) {
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const params = useParams();
  const id = params.id || null;

  const save = async (content: string) => {
    await api.put(`cards/${params.id}`, {
      content,
    });

    await queryClient.setQueryData(["card", id], (prev: any) => ({
      ...prev,
      content,
    }));

    setLoading(false);
  };

  useEffect(() => {
    const html = editor?.getHTML() || null;

    if (timeoutId) clearTimeout(timeoutId);

    const idTimeout = setTimeout(async () => {
      if (!html || !id) return;

      setLoading(true);

      save(html);
    }, 1000 * 5);

    setTimeoutId(idTimeout);

    return () => {
      clearTimeout(idTimeout);
    };
  }, [editor?.getHTML()]);

  useEffect(() => {
    return () => {
      const html = editor?.getHTML() || null;
      console.log(html);
      if (!!html) save(html);
    };
  }, [editor]);

  return { loading };
}
