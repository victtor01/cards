import { fontInter, fontOpenSans } from "@/fonts";
import { useSidebar, Workspace } from "@/hooks/use-sidebar";
import { useActionsWorkspaces } from "@/hooks/use-workspace";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
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
  setOpen?: () => void;
  workspaces: Workspace[];
  cards: Card[];
};

const classNameIfSelected = (selected: boolean) =>
  selected
    ? "bg-neutral-200 bg-opacity-70 dark:bg-zinc-900 text-black dark:text-white opacity-100 cursor-default shadow dark:shadow-black"
    : "hover:bg-zinc-100 dark:text-zinc-400 dark:hover:text-zinc-300 dark:hover:bg-zinc-900 opacity-70 hover:opacity-100";

export function WorkspaceLink(props: WorkspaceLinkProps) {
  const { id, name, workspaces, cards, setOpen: openParent } = props;
  const link = `/workspaces/${id}`;

  const pathname = usePathname();
  const { redirectTo } = useSidebar();
  const { createFile, createFolder } = useActionsWorkspaces();

  const selected = pathname.startsWith(link);

  // --- ALTERAÇÕES PRINCIPAIS AQUI ---

  // 1. Verifica se algum card filho está selecionado
  const isAnyCardSelected =
    cards?.some((card) => pathname.startsWith(`/card/${card.id}`)) ?? false;

  // 2. A "ramificação" está selecionada se o workspace ou um de seus cards estiverem ativos
  const isBranchSelected = selected || isAnyCardSelected;

  // 3. O estado 'open' agora considera a seleção do workspace OU de um card filho
  const [open, setOpen] = useState<boolean>(isBranchSelected);

  // O 'handleOpen' também usa a nova lógica
  const handleOpen = () => {
    if (isBranchSelected) {
      setOpen((prev) => !prev);
    } else {
      redirectTo(link);
      setOpen(true);
    }
  };

  useEffect(() => {
    if (isBranchSelected && openParent) {
      openParent();
    }
  }, [isBranchSelected, openParent]);

  const style = classNameIfSelected(selected);

  return (
    <div className="flex flex-col min-w-[9rem] w-auto text-base">
      <div
        className={`${style} ${fontOpenSans} w-full group flex gap-3 items-center justify-between p-1 rounded relative`}
      >
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
          className="text-left flex-nowrap flex-1 whitespace-nowrap text-ellipsis overflow-hidden"
        >
          {name}
        </button>
        <div className="flex items-center gap-2">
          <div className="hidden group-hover:flex gap-1 items-center group-hover:opacity-100">
            <button
              onClick={() => {
                createFile(id);
                setOpen(true);
              }}
              type="button"
              className="bg-zinc-800 text-white w-9 h-6 place-items-center rounded grid opacity-90 hover:opacity-100"
            >
              <CgFileAdd />
            </button>
            <button
              onClick={() => {
                createFolder(id);
                setOpen(true);
              }}
              type="button"
              className="bg-zinc-800 text-white w-9 h-6 place-items-center rounded grid opacity-90 hover:opacity-100"
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
          <WorkspaceLink
            setOpen={() => {
              setOpen(true);
              if (openParent) openParent();
            }}
            key={workspace.id}
            {...workspace}
          />
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
