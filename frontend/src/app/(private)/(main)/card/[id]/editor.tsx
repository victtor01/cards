import { Loader } from "@/components/loader";
import { fontFiraCode } from "@/fonts";
import { useEditorConfig } from "@/hooks/use-editor";
import { useThemeStore } from "@/hooks/use-theme";
import { ICard } from "@/interfaces/ICard";
import { getUpload } from "@/utils/get-upload";
import "@blocknote/core/fonts/inter.css";
import {
  BlockNoteView,
  darkDefaultTheme,
  lightDefaultTheme,
} from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FaCheck } from "react-icons/fa";
import { IoIosArrowBack } from "react-icons/io";
import TextareaAutosize from "react-textarea-autosize";
import { FileBackgroundUpdate } from "./background";
import { useUpdateContentCard, useUpdateTitleCard } from "./hooks";

export function EditorComponent({ card }: { card: ICard }) {
  const content = card?.content || null;

  const { title, onChangeTitle } = useUpdateTitleCard({ card });
  const { editor, ...styles } = useEditorConfig({ content });
  const { loading, updateContent } = useUpdateContentCard({ card, editor });
  const { onScroll, refToHeader, fixed } = styles;
  const { theme } = useThemeStore((store) => store);

  const router = useRouter();
  const image = !!card?.background ? getUpload(card?.background) : null;
  const lenghtTitle = 60;

  const defaultTheme = theme === "dark" ? darkDefaultTheme : lightDefaultTheme;

  return (
    <div
      onScroll={onScroll}
      ref={refToHeader}
      className="w-full h-screen overflow-y-auto overflow-x-hidden scroll-default relative"
    >
      <header
        data-fixed={!fixed}
        className="w-full px-3 py-2 gap-3 items-center sticky top-0 flex justify-between z-10 bg-white dark:bg-neutral-950
        dark:data-[fixed=true]:shadow-black data-[fixed=true]:shadow-md transition-shadow"
      >
        <div className="flex flex-1 items-center gap-2">
          <button
            onClick={() => router.push(`/workspaces/${card.workspaceId}`)}
            className="hover:bg-zinc-100 dark:hover:bg-zinc-900 opacity-70 hover:opacity-100 grid place-items-center w-10 h-10 rounded"
          >
            <IoIosArrowBack size={20} />
          </button>

          <label
            className="flex flex-1 group/title items-center gap-2"
            htmlFor="title-input"
          >
            <input
              value={title || ""}
              id="title-input"
              maxLength={lenghtTitle}
              onChange={onChangeTitle}
              placeholder="This is my new project..."
              className="bg-transparent outline-none text-zinc-600 dark:text-zinc-100 font-semibold placeholder:text-zinc-600 text-lg w-auto flex-1 transition-all focus:ring-1 p-1 px-2 rounded focus:ring-zinc-200 dark:ring-zinc-800"
            />

            <span className="text-zinc-400 text-sm opacity-0 group-focus-within/title:opacity-100">
              {lenghtTitle - (title?.length || 0)}
            </span>
          </label>
        </div>

        <div className="flex gap-2 items-center flex-1 justify-end">
          <div className="relative flex gap-2 items-center p-1 px-2 cursor-default pointer-events-none">
            {loading && (
              <div className="flex gap-2 items-center">
                <Loader className="w-5 h-5 " />
                <span className="text-sm text-zinc-400">Salvando...</span>
              </div>
            )}

            {!loading && (
              <div className="flex gap-2 items-center">
                <FaCheck className="opacity-50" size={12} />
                <span className="text-sm text-zinc-400">Salvo</span>
              </div>
            )}
          </div>
          <button
            type="button"
            className="p-1 px-2 bg-zinc-100 dark:bg-zinc-800 rounded text-zinc-500 opacity-90 hover:opacity-100 dark:text-zinc-100"
          >
            Tela cheia
          </button>
          <button
            type="button"
            className="p-1 px-2 bg-zinc-100 dark:bg-zinc-800 rounded text-zinc-500 opacity-90 hover:opacity-100 dark:text-zinc-100"
          >
            Publicar
          </button>
        </div>
      </header>

      {image && (
        <div className="w-full h-[30vh] bg-indigo-50 shadow-lg dark:shadow-black overflow-hidden relative dark:brightness-75">
          <Image src={image} alt="photo" fill objectFit="cover" />
        </div>
      )}

      <FileBackgroundUpdate />

      <div className="flex mx-auto w-full flex-col max-w-[70rem] mt-10 px-10">
        <div className="w-full px-1 hover:opacity-100 opacity-0 delay-[1.4s] hover:delay-0 flex">
          <span className="w-[3rem]" />
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
          <span className="w-[2.5rem]" />
          <TextareaAutosize
            value={title || ""}
            onChange={onChangeTitle}
            placeholder="This is my new project..."
            className="bg-transparent border border-transparent outline-none w-full text-6xl placeholder:text-zinc-700 break-word text-zinc-700 dark:text-zinc-300 resize-none"
          />
        </header>

        <BlockNoteView
          onChange={updateContent}
          editor={editor}
          theme={{
            borderRadius: 0,
            colors: {
              ...defaultTheme.colors,
              editor: {
                ...defaultTheme.colors.editor,
                background: "transparent",
              },
            },
          }}
        />
      </div>
    </div>
  );
}
