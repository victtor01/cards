import { useState } from "react";
import { IoClose, IoSettings } from "react-icons/io5";
import Link from "next/link";
import { fontFiraCode } from "@/fonts";

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
        className="text-zinc-400 hover:text-zinc-600 dark:hover:text-white text-lg"
      >
        <IoSettings size={20} />
      </button>

      {open && (
        <div className="absolute top-[100%] bg-white dark:bg-zinc-800 shadow dark:shadow-black rounded right-0 overflow-hidden">
          <Link
            href="?mdw=delete"
            className="flex text-red-600 items-center gap-2 p-2 hover:bg-zinc-100 dark:hover:bg-zinc-700"
          >
            <IoClose />
            <span className={fontFiraCode}>delete</span>
          </Link>
        </div>
      )}
    </div>
  );
};
