"use client";

import { EditorContent, FloatingMenu } from "@tiptap/react";
import { useEditorConfig } from "./hooks";
import { Bubble } from "./bubble";

interface EditorProps {
  content?: string | undefined;
}

export function Editor({ content }: EditorProps) {
  const { editorContentRef, editor } = useEditorConfig({ content });

  return (
    <>
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
    </>
  );
}
