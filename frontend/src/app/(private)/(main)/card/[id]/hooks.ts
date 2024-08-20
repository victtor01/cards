import { api } from "@/api";
import { ICard } from "@/interfaces/ICard";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { z } from "zod";

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

  const form = useForm<CreateCardProps>({
    resolver: zodResolver(schemaCreateCard),
    defaultValues: {
      content: card?.content || "",
    },
  });

  return {
    isLoading,
    form,
    card,
  };
}
