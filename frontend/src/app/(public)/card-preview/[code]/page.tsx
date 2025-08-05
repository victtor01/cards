"use client";

import { useParams } from "next/navigation";
import { usePublicCard } from "./hooks";
import { ViewerComponent } from "./viewer";

export default function PublicCard() {
  const param = useParams();
  const code: string = param?.code as string;

  if (!code) {
    throw new Error("Id do documento não está presente na url!");
  }

  const { card } = usePublicCard(code);
  const { data, isLoading } = card;

  if (isLoading) {
    return (
      <div className="grid place-items-center flex-1">
        <div className="font-semibold text-gray-500 text-2xl">
          Carregando documento...
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <span className="flex font-semibold text-2xl text-gray-500 dark:text-gra-200"></span>
      </div>
    );
  }

  return <ViewerComponent card={data} />;
}
