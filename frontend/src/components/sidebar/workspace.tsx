import { fontInter, fontOpenSans } from "@/fonts";
import { useSidebar, Workspace } from "@/hooks/use-sidebar";
import { useActionsWorkspaces } from "@/hooks/use-workspace";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { BsFiles } from "react-icons/bs";
import { CgFileAdd } from "react-icons/cg";
import { FaFolder, FaFolderOpen } from "react-icons/fa";
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

const classNameIfSelected = (selected: boolean) =>
  selected
    ? "bg-neutral-200 bg-opacity-70 dark:bg-zinc-900 text-zinc-800 dark:text-white opacity-100 cursor-default shadow dark:shadow-black"
    : "hover:bg-zinc-100 dark:text-zinc-400 dark:hover:text-zinc-300 dark:hover:bg-zinc-900 text-black opacity-70 hover:opacity-100";

export function WorkspaceLink(props: WorkspaceLinkProps) {
  const { id, name, workspaces, cards } = props;
  const link = `/workspaces/${id}`;

  const pathname = usePathname();
  const { redirectTo } = useSidebar();
  const { createFile, createFolder } = useActionsWorkspaces();

  const selected = pathname.startsWith(link);
  const style = classNameIfSelected(selected);

  const [open, setOpen] = useState<boolean>(selected);

  const handleOpen = () => {
    if (selected) {
      setOpen((prev) => !prev);
    } else {
      setOpen(true);
    }
  };

  return (
    <div className="flex flex-col min-w-[9rem] w-auto text-base">
      <div
        className={`${style} ${fontOpenSans} w-full group flex gap-3 items-center justify-between p-1 rounded relative`}
      >
        <div className="flex flex-1 text-left gap-3">
          <button

            onClick={() => setOpen((prev) => !prev)}
            data-selected={pathname.startsWith(link)}
            className={`${fontInter} pl-2`}
          >
            {!open ? <FaFolder size={16} /> : <FaFolderOpen size={16} />}
          </button>
          <button
            type="button"
            onClick={() => {
              redirectTo(link);
              handleOpen();
            }}
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
              className="bg-zinc-800 text-white w-7 h-5 place-items-center rounded grid"
            >
             <CgFileAdd />
            </button>
            <button
              onClick={() => {
                createFolder(id);
                setOpen(true);
              }}
              type="button"
              className="bg-zinc-800 text-white w-7 h-5 place-items-center rounded grid"
            >
              <TbFolderPlus size={15} />
            </button>
          </div>
        </div>
      </div>

      <div
        data-open={open}
        className="data-[open=false]:max-h-[0px] max-h-[30rem] data-[open=false]:opacity-0 data-[open=false]:pointer-events-none transition-all flex pt-1 gap-1 ml-[0.1rem] pl-1 border-l-2 border-transparent group-hover/sidebar:border-zinc-300 dark:group-hover/sidebar:border-zinc-800 dark:border-transparent border-opacity-70 flex-nowrap flex-col"
      >
        {workspaces?.map((workspace) => (
          <WorkspaceLink key={workspace.id} {...workspace} />
        ))}

        {cards?.map((card) => {
          const selected = pathname.startsWith(`/card/${card.id}`);
          const style = classNameIfSelected(selected);
          return (
            <Link
              key={card.id}
              href={`/card/${card.id}`}
              className={`${style} flex gap-2 items-center px-2 p-1 rounded`}
            >
              <BsFiles size={14} />
              <span
                id={card.id}
                className="whitespace-nowrap text-ellipsis flex-1 overflow-hidden"
              >
                {card.title}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
