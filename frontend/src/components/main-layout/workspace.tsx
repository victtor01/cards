import { fontInter } from "@/fonts";
import { useSidebar, Workspace } from "@/hooks/use-sidebar";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { BiPlus } from "react-icons/bi";
import { FaCaretRight } from "react-icons/fa";
import { TbFolderPlus } from "react-icons/tb";

type WorkspaceLinkProps = {
  name: string;
  code: string;
  workspaces: Workspace[];
};

export function WorkspaceLink({ name, code, workspaces }: WorkspaceLinkProps) {
  const pathname = usePathname();
  const { redirectTo } = useSidebar();

  const link = `/workspaces/${code}`;
  const selected = pathname.startsWith(link);
  const selectedClassStyle = selected
    ? "bg-zinc-800 text-gray-200 bg-opacity-50 opacity-100 cursor-default"
    : "hover:text-gray-300 hover:bg-zinc-800 text-gray-500 hover:bg-opacity-70 opacity-80 hover:opacity-100";

  const [open, setOpen] = useState<boolean>(selected);

  return (
    <div className="flex flex-col w-[17rem]" key={code}>
      <div
        className={`${selectedClassStyle} transition-all group flex gap-3 items-center justify-between p-2 rounded relative`}
      >
        <div className="flex flex-1 text-left gap-3  text-sm ">
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
            className="flex flex-nowrap whitespace-nowrap"
          >
            {name}
          </button>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex gap-1 items-center group-hover:opacity-100">
            <button
              type="button"
              className="bg-zinc-800 w-5 h-5 place-items-center rounded grid"
            >
              <BiPlus size={16} />
            </button>
            <button
              type="button"
              className="bg-zinc-800 w-5 h-5 place-items-center rounded grid"
            >
              <TbFolderPlus size={16} />
            </button>
          </div>

          <span className="w-5 h-5 text-xs bg-indigo-600 rounded grid place-items-center text-zinc-300">
            {workspaces?.length}
          </span>
        </div>
      </div>

      {open && (
        <div data-focus={selected} className="flex px-2 pt-1 ml-[0.5rem] border-l-2 transition-colors border-zinc-800 border-opacity-70 flex-nowrap flex-col w-full data-[focus=true]:border-indigo-600">
          {workspaces?.map((workspace) => (
            <WorkspaceLink {...workspace} />
          ))}
        </div>
      )}
    </div>
  );
}
