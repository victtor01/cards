import { useEditor } from "@tiptap/react";
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import StarterKit from "@tiptap/starter-kit";
import { useEffect, useRef } from "react";
import Document from "@tiptap/extension-document";
import Highlight from "@tiptap/extension-highlight";
import Paragraph from "@tiptap/extension-paragraph";
import TaskItem from "@tiptap/extension-task-item";
import TaskList from "@tiptap/extension-task-list";
import Text from "@tiptap/extension-text";
import { all, createLowlight } from 'lowlight'
import css from 'highlight.js/lib/languages/css'
import js from 'highlight.js/lib/languages/javascript'
import ts from 'highlight.js/lib/languages/typescript'
import html from 'highlight.js/lib/languages/xml'
interface useEditorConfigProps {
  content?: string | null;
}

const lowlight = createLowlight(all)

lowlight.register('html', html)
lowlight.register('css', css)
lowlight.register('js', js)
lowlight.register('ts', ts)

export const useEditorConfig = ({ content = null }: useEditorConfigProps) => {
  const editorContentRef = useRef<HTMLDivElement>(null);

  const editor = useEditor({
    extensions: [
      CodeBlockLowlight,
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Highlight.configure({ multicolor: true }),
      TaskItem.configure({
        nested: true,
      }),
      Document,
      Paragraph,
      Text,
      TaskList,
    ],
    content: content || "<p>This is a example...</p>",
    editorProps: {
      attributes: {
        class: `outline-none`,
      },
    },
  });

  useEffect(() => {
    const el: HTMLCollectionOf<Element> =
      document.getElementsByClassName("category");

    if (el) {
      Array.from(el).forEach((element) => {
        console.log(element);
      });
    }
  }, [editor?.getHTML()]);

  const handleClick = (event: MouseEvent) => {
    const focus =
      editorContentRef.current &&
      editor &&
      editorContentRef.current.contains(event.target as Node);

    if (focus) editor.commands.focus();
  };

  useEffect(() => {
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
