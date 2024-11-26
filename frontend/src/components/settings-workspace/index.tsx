import { fontFiraCode } from "@/fonts";
import Link from "next/link";
import { useState } from "react";
import { BiTrash } from "react-icons/bi";
import { IoSettings } from "react-icons/io5";

const useSettings = () => {
  const [open, setOpen] = useState<boolean>(false);
  const handleOpen = () => setOpen((prev) => !prev);

  return {
    open,
    handleOpen,
  };
};

export const Settings = () => {
  const { open, handleOpen } = useSettings();

  return (
    <div className="relative">
      <button
        onClick={handleOpen}
        className="opacity-80 hover:opacity-100 items-center flex gap-2 px-3 h-8 rounded bg-zinc-100 dark:bg-neutral-800 shadow dark:shadow-black border-l dark:border-zinc-800/90"
      >
        <span
          data-open={!!open}
          className="data-[open=true]:rotate-[45deg] transition-transform"
        >
          <IoSettings size={20} />
        </span>
      </button>

      {open && (
        <div className="absolute top-[100%] mt-5 bg-white dark:bg-zinc-900 shadow dark:shadow-black rounded right-0 overflow-hidden">
          <Link
            href="?mdw=delete"
            className="flex text-red-600 items-center gap-2 p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800"
          >
            <BiTrash />
            <span className={fontFiraCode}>Lixeira</span>
          </Link>
        </div>
      )}
    </div>
  );
};
