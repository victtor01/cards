import { api } from "@/api";
import { ICard } from "@/interfaces/ICard";
import { useQuery } from "@tanstack/react-query";

export const usePublicCard = (code: string) => {
  const card = useQuery<ICard>({
    queryKey: ["cards", code],
    queryFn: async () => (await api.get(`/cards/publish/${code}`))?.data,
  });

  return {
    card,
  };
};
