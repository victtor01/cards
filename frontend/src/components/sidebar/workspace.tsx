import { fontInter, fontOpenSans } from "@/fonts";
import { useSidebar, Workspace } from "@/hooks/use-sidebar";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { type } from "os";
import { title } from "process";
import { useEffect, useState } from "react";
import { BiPlus } from "react-icons/bi";
import { FaCaretRight, FaFile } from "react-icons/fa";
import { TbFolderPlus } from "react-icons/tb";
import { map } from "zod";
import workspaces from "../workspaces";
import { useActionsWorkspaces } from "@/hooks/use-workspace";

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

export function WorkspaceLink(props: WorkspaceLinkProps) {
  const { id, name, workspaces, cards } = props;
  const link = `/workspaces/${id}`;

  const pathname = usePathname();
  const { redirectTo } = useSidebar();
  const { createFile, createFolder } = useActionsWorkspaces();
  const selected = pathname.startsWith(link);

  const selectedClassStyle = selected
    ? "bg-neutral-200 bg-opacity-70 dark:bg-zinc-900 text-zinc-800 dark:text-white opacity-100 cursor-default shadow dark:shadow-black"
    : "hover:bg-zinc-100 dark:text-zinc-400 dark:hover:text-zinc-300 dark:hover:bg-zinc-900 text-black opacity-70 hover:opacity-100";

  const [open, setOpen] = useState<boolean>(selected);

  useEffect(() => {
    if (selected) setOpen(true);
  }, [selected]);

  return (
    <div className="flex flex-col min-w-[9rem] w-auto">
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
            id={`${id}`}
            className="flex flex-nowrap flex-1 whitespace-nowrap text-ellipsis"
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
              className="bg-white dark:bg-zinc-800 w-5 h-5 place-items-center rounded grid"
            >
              <BiPlus size={16} />
            </button>
            <button
              onClick={() => {
                createFolder(id);
                setOpen(true);
              }}
              type="button"
              className="bg-white dark:bg-zinc-800 w-5 h-5 place-items-center rounded grid"
            >
              <TbFolderPlus size={16} />
            </button>
          </div>
        </div>
      </div>

      {open && (
        <div
          data-focus={false}
          className="flex pt-1 ml-[0.1rem] pl-1 border-l-2 transition-colors border-transparent group-hover/sidebar:border-zinc-300 dark:group-hover/sidebar:border-zinc-800 dark:border-transparent border-opacity-70 flex-nowrap flex-col dark:data-[focus=true]:border-indigo-600"
        >
          {workspaces?.map((workspace) => (
            <WorkspaceLink key={workspace.id} {...workspace} />
          ))}

          {cards?.map((card) => (
            <Link
              key={card.id}
              href={`/card/${card.id}`}
              className="text-sm text-black flex gap-3 items-center p-1 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:text-zinc-300 dark:hover:bg-zinc-800 rounded opacity-70 hover:opacity-100"
            >
              <FaFile size={12} />
              <span
                id={card.id}
                className="whitespace-nowrap text-ellipsis flex-1 overflow-hidden"
              >
                {card.title}
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
