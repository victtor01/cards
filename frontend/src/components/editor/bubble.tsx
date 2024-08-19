import { BubbleMenu, Editor } from "@tiptap/react";
import { IoList } from "react-icons/io5";
import { LuHeading1, LuHeading2 } from "react-icons/lu";
import { RxFontBold, RxFontItalic, RxStrikethrough, RxCode } from "react-icons/rx";
import { ButtonBubble } from "./button-bubble";
import { FaPaintbrush } from "react-icons/fa6";
import { FaBookmark } from "react-icons/fa";

export const Bubble = ({ editor }: { editor: Editor }) => (
  <BubbleMenu
    editor={editor}
    className=" w-full flex bg-zinc-900 border border-zinc-800 text-zinc-200 rounded shadow-lg dark:shadow-black divide-x divide-zinc-700"
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
      data-active={editor.isActive("heading", { level: 1 })}
      onClick={() => editor.chain().focus().setHeading({ level: 1 }).run()}
    >
      <LuHeading1 size={20} />
    </ButtonBubble>
    <ButtonBubble
      data-active={editor.isActive("heading", { level: 2 })}
      onClick={() => editor.chain().focus().setHeading({ level: 2 }).run()}
    >
      <LuHeading2 size={20} />
    </ButtonBubble>
    <ButtonBubble
      data-active={editor.isActive("taskList")}
      onClick={() => editor.chain().focus().toggleTaskList().run()}
    >
      <IoList />
    </ButtonBubble>
    <ButtonBubble
      data-active={editor.isActive("highlight", {
        color: "rgb(55 48 163)",
      })}
      onClick={() =>
        editor
          .chain()
          .focus()
          .toggleHighlight({ color: "rgb(55 48 163)" })
          .run()
      }
    >
      <FaPaintbrush />
    </ButtonBubble>
    <ButtonBubble
      data-active={editor.isActive("categorize")}
      onClick={() => editor.chain().focus().markWord().run()}
    >
      <FaBookmark />
    </ButtonBubble>
  </BubbleMenu>
);
