import { fontInter, fontOpenSans } from "@/fonts";
import { useSidebar, Workspace } from "@/hooks/use-sidebar";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { BiPlus } from "react-icons/bi";
import { FaCaretRight, FaFile } from "react-icons/fa";
import { TbFolderPlus } from "react-icons/tb";

type Card = {
  id: string;
  title: string;
};

type WorkspaceLinkProps = {
  id: string;
  name: string;
  code: string;
  workspaces: Workspace[];
  cards: Card[];
};

export function WorkspaceLink({
  id,
  name,
  code,
  workspaces,
  cards,
}: WorkspaceLinkProps) {
  const pathname = usePathname();
  const { redirectTo, createFolder, createFile } = useSidebar();

  const link = `/workspaces/${code}`;
  const selected = pathname.startsWith(link);
  const selectedClassStyle = selected
    ? "bg-neutral-200 bg-opacity-70 dark:bg-zinc-800 text-zinc-800 dark:text-white opacity-100 cursor-default"
    : "hover:bg-zinc-100 dark:text-zinc-400 dark:hover:text-zinc-300 dark:hover:bg-zinc-800 text-zinc-600 opacity-70 hover:opacity-100";

  const [open, setOpen] = useState<boolean>(selected);

  return (
    <div className="flex flex-col min-w-[9rem] w-auto" key={code}>
      <div
        className={`${selectedClassStyle} ${fontOpenSans} w-full group flex gap-3 items-center justify-between p-1 rounded relative`}
      >
        <div className="flex flex-1 text-left gap-3 text-sm">
          <button
            onClick={() => setOpen((prev) => !prev)}
            data-selected={pathname.startsWith(link)}
            className={`${fontInter}`}
          >
            <FaCaretRight
              size={18}
              data-selected={open}
              className="data-[selected=true]:rotate-90 transition-all"
            />
          </button>
          <button
            type="button"
            onClick={() => redirectTo(link)}
            className="flex flex-nowrap whitespace-nowrap flex-1"
          >
            {name}
          </button>
        </div>
        <div className="flex items-center gap-2">
          <div className="hidden group-hover:flex gap-1 items-center group-hover:opacity-100">
            <button
              onClick={() => {
                createFile(id);
                setOpen(true);
              }}
              type="button"
              className="bg-zinc-200 dark:bg-zinc-800 w-5 h-5 place-items-center rounded grid"
            >
              <BiPlus size={16} />
            </button>
            <button
              onClick={() => {
                createFolder(id);
                setOpen(true);
              }}
              type="button"
              className="bg-zinc-200 dark:bg-zinc-800 w-5 h-5 place-items-center rounded grid"
            >
              <TbFolderPlus size={16} />
            </button>
          </div>
        </div>
      </div>

      {open && (
        <div
          data-focus={false}
          className="flex pt-1 ml-[0.1rem] pl-1 border-l-2 transition-colors border-transparent group-hover/sidebar:border-zinc-300 dark:group-hover/sidebar:border-zinc-800 dark:border-transparent border-opacity-70 flex-nowrap flex-col w-full dark:data-[focus=true]:border-indigo-600"
        >
          {workspaces?.map((workspace) => (
            <WorkspaceLink {...workspace} />
          ))}

          {cards?.map((card) => (
            <Link
              href={"#"}
              className="text-sm text-zinc-600 flex gap-3 items-center p-1 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:text-zinc-300 dark:hover:bg-zinc-800 rounded opacity-70 hover:opacity-100"
            >
              <FaFile size={12} />
              <span>{card.title}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
