"use client";

import {
  RxCode,
  RxFontBold,
  RxFontItalic,
  RxPlus,
  RxStrikethrough,
} from "react-icons/rx";
import StarterKit from "@tiptap/starter-kit";
import {
  useEditor,
  EditorContent,
  BubbleMenu,
} from "@tiptap/react";
import { ButtonBubble } from "./button-bubble";
import { useRef, useEffect } from "react";

export function Editor() {
  const editorContentRef = useRef<HTMLDivElement>(null);
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3], // Níveis de cabeçalhos disponíveis
        },
      }),
    ],
    content: `<p>put something...</p>`,
    editorProps: {
      attributes: {
        class: `outline-none`,
      },
    },
  });


  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (
        editorContentRef.current &&
        !editorContentRef.current.contains(event.target as Node)
      ) {
        editor?.commands.focus();
      }
    };

    document.addEventListener("click", handleClick);

    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, [editor]);

  return (
    <div className="flex p-10">
      <EditorContent
        ref={editorContentRef}
        editor={editor}
        className="prose prose-invert max-w-[65rem] flex-1 px-5 text-lg"
      />

      {editor && (
        <BubbleMenu
          editor={editor}
          className="flex bg-zinc-900 border border-zinc-800 text-zinc-200 rounded shadow-lg shadow-black divide-x divide-zinc-700"
        >
          <ButtonBubble
            data-active={editor.isActive("bold")}
            onClick={() => editor.chain().focus().toggleBold().run()}
          >
            <RxFontBold size={20} />
          </ButtonBubble>
          <ButtonBubble
            data-active={editor.isActive("italic")}
            onClick={() => editor.chain().focus().toggleItalic().run()}
          >
            <RxFontItalic size={20} />
          </ButtonBubble>
          <ButtonBubble
            data-active={editor.isActive("strike")}
            onClick={() => editor.chain().focus().toggleStrike().run()}
          >
            <RxStrikethrough size={20} />
          </ButtonBubble>
          <ButtonBubble
            data-active={editor.isActive("code")}
            onClick={() => editor.chain().focus().toggleCode().run()}
          >
            <RxCode size={20} />
          </ButtonBubble>
          <ButtonBubble
            onClick={() =>
              editor.chain().focus().setHeading({ level: 2 }).run()
            }
          >
            <RxPlus size={20} />
          </ButtonBubble>
        </BubbleMenu>
      )}
    </div>
  );
}
