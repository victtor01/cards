import LinkComponent from "@/components/link-component";
import { fontFiraCode } from "@/fonts";
import { IWorkspace } from "@/interfaces/IWorkspace";
import { IoAddCircle, IoGrid } from "react-icons/io5";
import { MdOutlineDriveFileRenameOutline } from "react-icons/md";

type FilesProps = {
  workspace: IWorkspace;
};

export function Files({ workspace }: FilesProps) {
  return (
    <div className="w-full my-5 mt-10">
      <div className="w-full max-w-main mx-auto flex flex-col gap-1">
        <header className="justify-between flex w-full items-center gap-4 rounded-lg">
          <div className="flex gap-3 items-center cursor-default px-2">
            <IoGrid />
            <span className={fontFiraCode}>Workspaces</span>
          </div>
        </header>

        <section className="flex flex-wrap w-full mt-3">
          {workspace?.workspaces?.map((workspace) => {
            const { name, background, id } = workspace;
            return (
              <LinkComponent
                name={name}
                background={background}
                href={`/workspaces/${id}`}
                key={id}
              />
            );
          })}
          <button className="w-[8rem] h-[8rem] mx-1 group/link mb-2 grid place-items-center opacity-90 hover:opacity-100 overflow-hidden rounded-lg bg-zinc-50 dark:bg-zinc-900 dark:border-zinc-800 border-2 dark:border-dashed border-dashed ">
            <span>
              <IoAddCircle size={40} className="text-zinc-600" />
            </span>
          </button>
        </section>
      </div>

      <div className="w-full max-w-main mx-auto flex flex-col gap-1 mt-10">
        <header className="justify-between flex w-full items-center gap-4 rounded-lg">
          <div className="flex gap-3 items-center cursor-default px-2">
            <MdOutlineDriveFileRenameOutline />
            <span className={fontFiraCode}>Files</span>
          </div>
        </header>

        <section className="flex flex-wrap w-full mt-3">
          {workspace?.cards?.map((card) => {
            const { title, background, id, createdAt } = card;
            return (
              <LinkComponent
                name={title}
                createdAt={createdAt}
                type="file"
                background={background}
                href={`/card/${id}`}
                key={id}
              />
            );
          })}

          <button className="w-[8rem] h-[8rem] mx-1 group/link mb-2 grid place-items-center opacity-90 hover:opacity-100 overflow-hidden rounded-lg bg-zinc-50 dark:bg-zinc-900 dark:border-zinc-800 border-2 dark:border-dashed border-dashed ">
            <span>
              <IoAddCircle size={40} className="text-zinc-600" />
            </span>
          </button>
        </section>
      </div>
    </div>
  );
}
