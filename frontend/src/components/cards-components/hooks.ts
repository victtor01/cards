import { api } from "@/api";
import { queryClient } from "@/providers/query-client";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import copy from "copy-to-clipboard";
import { useState } from "react";
import { toast } from "react-toastify";

export const useCardPublish = () => {
  const [isCopied, setIsCopied] = useState(false);

  const publishMutation = useMutation({
    mutationFn: async (cardId: string) => {
      console.log("teste");
      const updated = await api.post("/cards/publish", {
        cardId,
      });

      return updated;
    },

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["cards"],
      });

      toast.success("Publicado com sucesso!");
    },

    onError: (err: unknown) => {
      if (err instanceof AxiosError) {
        toast.error(
          err?.response?.data?.message || "Houve um erro interno no servidor!"
        );
      } else {
        toast.error("Houve um erro desconhecido!");
      }
    },
  });

  const handleCopy = async (code?: string | null) => {
    if (!code) {
      toast.error("Código n está presente!");
      return;
    }

    try {
      copy(code);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
      toast.success("Copiado com sucesso!");
    } catch (err) {
      console.error(
        "Falha ao copiar o código para a área de transferência:",
        err
      );
    }
  };

  return {
    publishMutation,
    handleCopy,
    isCopied,
  };
};
