import "@blocknote/core/fonts/inter.css";
import "@blocknote/mantine/style.css";

import { fontRoboto } from "@/fonts";
import { useEditorConfig } from "@/hooks/use-editor"; // Ainda usamos para inicializar o editor
import { useThemeStore } from "@/hooks/use-theme";
import { ICard } from "@/interfaces/ICard";
import { getUpload } from "@/utils/get-upload";
import {
  BlockNoteView,
  darkDefaultTheme,
  lightDefaultTheme,
} from "@blocknote/mantine";
import Image from "next/image";

export function ViewerComponent({ card }: { card: ICard }) {
  const content = card?.content || null;
  const title = card?.title || "Sem título"; // Usamos o título diretamente do card

  const { editor } = useEditorConfig({ content });
  const { theme } = useThemeStore((store) => store);

  const image = !!card?.background ? getUpload(card.background) : null;
  const defaultTheme = theme === "dark" ? darkDefaultTheme : lightDefaultTheme;

  if (!editor) {
    return <div>Carregando conteúdo...</div>;
  }

  return (
    <div className="w-full h-screen overflow-y-auto overflow-x-hidden scroll-default relative">
      {image && (
        <div className="w-full h-[30vh] bg-indigo-50 shadow-lg dark:shadow-black overflow-hidden relative dark:brightness-75">
          <Image src={image} alt="photo" fill objectFit="cover" />
        </div>
      )}

      <div className="flex mx-auto w-full flex-col max-w-[70rem] mt-10 px-10">
        <header className={`${fontRoboto} flex gap-4 mt-3`}>
          <span className="w-[2.5rem]" />
          <h1 className="bg-transparent font-semibold leading-[4rem] border-transparent outline-none w-full text-[4.5rem] break-word text-zinc-800 dark:text-zinc-300 resize-none">
            {title}
          </h1>
        </header>

        <section className="references font-semibold text-xl">
          <BlockNoteView
            editable={false}
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
          ></BlockNoteView>
        </section>
      </div>
    </div>
  );
}
