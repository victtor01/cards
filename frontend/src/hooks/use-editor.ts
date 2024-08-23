import StarterKit from "@tiptap/starter-kit";
import { useEditor, EditorContent, extensions } from "@tiptap/react";
import { useRef, useEffect, useState } from "react";

import Document from "@tiptap/extension-document";
import Paragraph from "@tiptap/extension-paragraph";
import TaskItem from "@tiptap/extension-task-item";
import TaskList from "@tiptap/extension-task-list";
import Text from "@tiptap/extension-text";
import Highlight from "@tiptap/extension-highlight";
import { CustomSpan } from "@/constants/editor-constants";
import { log } from "console";

interface useEditorConfigProps {
  content?: string | null;
}

export const useEditorConfig = ({ content = null }: useEditorConfigProps) => {
  const editorContentRef = useRef<HTMLDivElement>(null);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      CustomSpan,
      Highlight.configure({ multicolor: true }),
      TaskItem.configure({
        nested: true,
      }),
      Document,
      Paragraph,
      Text,
      TaskList,
    ],
    content: content,
    editorProps: {
      attributes: {
        class: `outline-none`,
      },
    },
  });

  useEffect(() => {
    if (content && editor) editor?.commands.setContent(content || "<p></p>");
  }, [content, editor]);

  useEffect(() => {
    const el: HTMLCollectionOf<Element> =
      document.getElementsByClassName("category");

    if (el) {
      Array.from(el).forEach((element) => {
        console.log(element);
      });
    }
  }, [editor?.getHTML()]);

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      const focus =
        editorContentRef.current &&
        editor &&
        editorContentRef.current.contains(event.target as Node);

      if (focus) editor.commands.focus();
    };

    document.addEventListener("click", handleClick);

    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, [editor]);

  return {
    editorContentRef,
    editor,
  };
};
