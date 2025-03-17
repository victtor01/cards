import { Alert } from "@/components/block-note-extenstions/alert";
import { BlockNoteSchema, defaultBlockSpecs, insertOrUpdateBlock, locales } from "@blocknote/core";
import { useCreateBlockNote } from "@blocknote/react";
import { useRef, useState } from "react";
import "@blocknote/core/fonts/inter.css";
import "@blocknote/mantine/style.css";
import { RiAlertFill } from "react-icons/ri";
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

const schema = BlockNoteSchema.create({
  blockSpecs: {
    ...defaultBlockSpecs,
    alert: Alert,
  },
});

export const insertAlert = (editor: typeof schema.BlockNoteEditor) => ({
  title: "Alert",
  onItemClick: () => {
    insertOrUpdateBlock(editor, {
      type: "alert",
    });
  },
  aliases: [
    "alert",
    "notification",
    "emphasize",
    "warning",
    "error",
    "info",
    "success",
  ],
  group: "Other",
  icon: <RiAlertFill />,
});

export const useEditorConfig = ({ content }: useEditorConfigProps) => {
  const editorContentRef = useRef<HTMLDivElement>(null);
  const [fixed, setFixed] = useState<boolean>(true);

  const editor = useCreateBlockNote({
    schema,
    initialContent: getJsonValid(content || ""),
    dictionary: locales.pt,
    domAttributes: {
      blockGroup: { class: "text-xl" },
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
