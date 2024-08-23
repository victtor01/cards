import { fontFiraCode } from "@/fonts";
import { Workspace } from "@/interfaces/IWorkspace";
import { IoGrid } from "react-icons/io5";
import { BiPlus } from "react-icons/bi";
import { TbFolderPlus } from "react-icons/tb";
import LinkComponent from "@/components/link-component";

type FilesProps = {
  workspace: Workspace;
};

export function Files({ workspace }: FilesProps) {
  return (
    <div className="w-full my-5">
      <div className="w-full max-w-main mx-auto flex flex-col gap-1">
        <header className="justify-between flex w-full items-center gap-4 bg-zinc-100 dark:bg-zinc-900 p-2 rounded-lg shadow dark:shadow-black">
          <div className="flex gap-3 items-center cursor-default px-2">
            <IoGrid />
            <span className={fontFiraCode}>Workspaces</span>
          </div>
          <div className="flex gap-2 items-center">
            <button className="h-8 w-8 items-center gap-2 bg-white grid place-items-center rounded-lg dark:bg-zinc-700 hover:shadow-lg dark:hover:shadow-black">
              <BiPlus size={16} />
            </button>

            <button className="h-8 w-8 items-center gap-2 bg-white grid place-items-center rounded-lg dark:bg-zinc-700 hover:shadow-lg dark:hover:shadow-black">
              <TbFolderPlus />
            </button>
          </div>
        </header>

        <section className="flex flex-wrap w-full mt-3">
          {workspace?.workspaces?.map(({ name, background, code }) => {
            return (
              <LinkComponent
                name={name}
                background={background}
                href={`/workspaces/${code}`}
                key={code}
              />
            );
          })}

          {workspace?.cards?.map(({ id, title, background }) => {
            return (
              <LinkComponent
                name={title}
                type="file"
                background={background}
                href={`/card/${id}`}
                key={id}
              />
            );
          })}
        </section>
      </div>
    </div>
  );
}
