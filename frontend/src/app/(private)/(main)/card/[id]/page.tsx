"use client";

import { Bubble } from "@/components/editor/bubble";
import { Loader } from "@/components/loader";
import { fontFiraCode } from "@/fonts";
import { useEditorConfig } from "@/hooks/use-editor";
import { getUpload } from "@/utils/get-upload";
import { EditorContent } from "@tiptap/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FaCheck } from "react-icons/fa";
import { IoIosArrowBack } from "react-icons/io";
import TextareaAutosize from "react-textarea-autosize";
import { FileBackgroundUpdate } from "./background";
import { useCard, useUpdateContentCard, useUpdateTitleCard } from "./hooks";

type CardProps = {
  params: {
    id: string;
  };
};

export default function Card({ params }: CardProps) {
  const router = useRouter();
  const { card, isLoading } = useCard(params.id);
  const { title, onChangeTitle } = useUpdateTitleCard(card, isLoading);

  const content = card?.content || null;
  const { editor, editorContentRef } = useEditorConfig({ content });
  const { loading } = useUpdateContentCard(editor, card?.content);

  if (isLoading) return;

  if (!card) return;

  const image = !!card?.background ? getUpload(card?.background) : null;

  return (
    <div className="w-full h-auto relative p-5">
      {image && (
        <div className="top-0 w-full left-0 h-[30vh] bg-indigo-50 rounded-xl shadow-lg dark:shadow-black overflow-hidden relative dark:brightness-75">
          <Image src={image} alt="photo" fill objectFit="cover" />
        </div>
      )}

      <header className="w-full p-2 flex gap-3 items-center relative z-30">
        <button
          onClick={() => router.push(`/workspaces/${card.workspaceId}`)}
          className="hover:bg-zinc-100 dark:hover:bg-zinc-800 opacity-70 hover:opacity-100 grid place-items-center w-10 h-10 rounded"
        >
          <IoIosArrowBack size={20} />
        </button>

        <div className="flex">
          <input
            value={title || ""}
            onChange={onChangeTitle}
            placeholder="This is my new project..."
            className="bg-transparent outline-none placeholder:text-zinc-600 text-lg"
          />
        </div>

        <div
          data-loading={loading}
          className="absolute dark:bg-zinc-800 right-3 bg-zinc-100 flex gap-2 items-center p-1 px-2 rounded shadow"
        >
          {loading && (
            <div className="flex gap-2 items-center">
              <Loader className="w-5 h-5 " />
              <span className="text-sm text-zinc-400">Salvando...</span>
            </div>
          )}

          {!loading && (
            <div className="flex gap-2 items-center">
              <FaCheck className="opacity-50" />
              <span className="text-sm text-zinc-400">Salvo</span>
            </div>
          )}
        </div>
      </header>

      <FileBackgroundUpdate />

      <div className="flex mx-auto w-full flex-col max-w-[65rem] mt-20 ">
        <div className="w-full px-1 hover:opacity-100 opacity-0 delay-[1.4s] hover:delay-0">
          <Link
            href={`?ub-card=${card.id}`}
            className="p-1 px-2 bg-zinc-50 dark:bg-zinc-800 border-2 border-dashed dark:border-zinc-800 rounded opacity-70 hover:opacity-100"
          >
            <span
              className={`${fontFiraCode} dark:text-zinc-100 text-zinc-600 text-sm`}
            >
              upload background
            </span>
          </Link>
        </div>

        <header className="flex gap-4 mt-3">
          <TextareaAutosize
            value={title || ""}
            onChange={onChangeTitle}
            placeholder="This is my new project..."
            className="bg-transparent border border-transparent outline-none w-full text-6xl placeholder:text-zinc-700 break-word text-zinc-700 dark:text-zinc-300 resize-none"
          />
        </header>

        <EditorContent
          ref={editorContentRef}
          editor={editor}
          className="prose dark:prose-invert prose-li:p-0 max-w-[60rem] flex-1 text-lg mt-10 p-0 min-h-[30rem] relative"
        >
          {editor?.getHTML() === "<p></p>" && (
            <span className="pointer-events-none absolute  top-0 text-zinc-500 text-xl">
              Start here...
            </span>
          )}
        </EditorContent>

        {editor && <Bubble editor={editor} />}
      </div>
    </div>
  );
}
