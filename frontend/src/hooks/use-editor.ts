import { locales } from "@blocknote/core";
import { useCreateBlockNote } from "@blocknote/react";
import { useRef, useState } from "react";

interface useEditorConfigProps {
  content?: string | null;
}

const getJsonValid = (content: string | "") => {
  try {
    const json = JSON.parse(content);
    return json;
  } catch (error) {
    return null;
  }
};

export const useEditorConfig = ({ content }: useEditorConfigProps) => {
  const editorContentRef = useRef<HTMLDivElement>(null);
  const [fixed, setFixed] = useState<boolean>(true);

  const editor = useCreateBlockNote({
    initialContent: getJsonValid(content || ""),
    dictionary: locales.pt,
    domAttributes: {
      blockGroup: {
        class: "text-xl",
      },
    },
  });

  const refToHeader = useRef<HTMLDivElement | null>(null);

  const onScroll = () => {
    setFixed(() => !!(refToHeader.current?.scrollTop === 0));
  };

  return {
    editorContentRef,
    refToHeader,
    onScroll,
    fixed,
    editor,
  };
};
