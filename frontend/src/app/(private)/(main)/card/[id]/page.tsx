"use client";

import "@blocknote/core/fonts/inter.css";
import "@blocknote/mantine/style.css";
import { useCard } from "./hooks";
import { EditorComponent } from "./editor";

export type CardProps = {
  params: {
    id: string;
  };
};

export default function Card({ params }: CardProps) {
  const { card, isLoading } = useCard(params.id);

  if (!card || isLoading) return;

  return <EditorComponent card={card} />;
}
