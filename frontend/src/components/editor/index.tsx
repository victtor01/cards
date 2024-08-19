"use client";

import { EditorContent } from "@tiptap/react";
import { useEditorConfig } from "./hooks";
import { Bubble } from "./bubble";

interface EditorProps {
  content?: string | undefined;
};

export function Editor({ content }: EditorProps) {
  const { editorContentRef, editor } = useEditorConfig({ content });

  return (
    <>
      <EditorContent
        ref={editorContentRef}
        editor={editor}
        className="prose dark:prose-invert prose-li:flex max-w-[60rem] flex-1 text-lg mt-10 p-0 min-h-[30rem] relative"
      >
        {editor?.getHTML() === "<p></p>" && (
          <span className="pointer-events-none absolute  top-0 text-zinc-500 text-xl">
            Start here...
          </span>
        )}
      </EditorContent>

      {editor && <Bubble editor={editor} />}
    </>
  );
}

// editor
//   .chain()
//   .focus()
//   .markWord()
//   // .toggleMark("customSpan", {
//   //   class:
//   //     "bg-indigo-700 p-1 px-2 rounded shadow-xl shadow-black",
//   // })
//   .run()
