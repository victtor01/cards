import { Modal } from "@/components/modal";
import { useParams, useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ModalToUploadBackground } from "@/components/uploads-background-workspace";
import { api } from "@/api";
import { queryClient } from "@/providers/query-client";

// update background card
const nameOfParam = "ub-card";

const update = async ({ file, id }: any) => {
  const form = new FormData();
  form.append("background", file);

  await api.put(`/cards/background/${id}`, form);

  await Promise.all([
    queryClient.refetchQueries({ queryKey: ["workspaces"] }),
    queryClient.refetchQueries({ queryKey: ["card", id] }),
  ]);
};

export function FileBackgroundUpdate() {
  const { id } = useParams();
  const searchParams = useSearchParams();
  const cardId = searchParams.get(nameOfParam) || null;

  return (
    <AnimatePresence>
      {!!cardId && (
        <ModalToUploadBackground update={({ file }) => update({ file, id })} />
      )}
    </AnimatePresence>
  );
}
