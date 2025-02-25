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

  if (!card || isLoading) {
    return (
      <div className="flex flex-col h-screen overflow-hidden">
        <div className="w-full p-4 flex justify-between gap-2 animate-pulse">
          <div className="flex gap-2 items-center">
            <div className="w-12 h-12 rounded bg-zinc-200 dark:bg-zinc-900"></div>
            <div className="w-[15rem] h-8 bg-zinc-200 dark:bg-zinc-900 rounded"></div>
          </div>

          <div className="flex gap-2 items-center">
            <div className="w-[7rem] h-6 bg-zinc-200 dark:bg-zinc-900 rounded"></div>
            <div className="w-[6rem] h-10 bg-zinc-200 dark:bg-zinc-900 rounded"></div>
            <div className="w-[6rem] h-10 bg-zinc-200 dark:bg-zinc-900 rounded"></div>
          </div>
        </div>

        <div className="mt-10 mx-auto w-full flex flex-col max-w-[60rem] animate-pulse">
          <div className="flex w-full h-16 bg-zinc-200 dark:bg-zinc-900 rounded animate-pulse" />

          <div className="flex w-full flex-col mt-5 gap-5">
            <div className="flex flex-col gap-2">
              <div className="flex flex-col w-full p-4 bg-zinc-200 dark:bg-zinc-900 rounded" />
              <div className="flex flex-col w-[60%] p-4 bg-zinc-200 dark:bg-zinc-900 rounded" />
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex flex-col w-full p-4 bg-zinc-200 dark:bg-zinc-900 rounded" />
              <div className="flex flex-col w-full p-4 bg-zinc-200 dark:bg-zinc-900 rounded" />
              <div className="flex flex-col w-full p-4 bg-zinc-200 dark:bg-zinc-900 rounded" />
              <div className="flex flex-col w-[20%] p-4 bg-zinc-200 dark:bg-zinc-900 rounded" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <EditorComponent card={card} />;
}
