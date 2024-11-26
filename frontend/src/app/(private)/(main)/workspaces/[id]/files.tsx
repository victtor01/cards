import LinkComponent from "@/components/link-component";
import { fontFiraCode, fontSaira } from "@/fonts";
import { useActionsWorkspaces } from "@/hooks/use-workspace";
import { IWorkspace } from "@/interfaces/IWorkspace";
import { useParams } from "next/navigation";
import { IoAddCircle, IoGrid } from "react-icons/io5";
import { MdOutlineDriveFileRenameOutline } from "react-icons/md";
import { toast } from "react-toastify";

type FilesProps = {
  workspace: IWorkspace;
};

const useFiles = () => {
  const { createFolder, createFile } = useActionsWorkspaces();
  const params = useParams();

  const id = typeof params.id === "string" ? params.id : null;

  const createFolderHandle = async () => {
    if (!id) return;

    await toast.promise(createFolder(id), {
      pending: "Criando workspacs...",
      error: "Erro ao criar workspace!",
      success: "Criado!",
    });
  };

  const createCardHandle = async () => {
    if (!id) return;

    await toast.promise(createFile(id), {
      pending: "Criando workspacs...",
      error: "Erro ao criar workspace!",
      success: "Criado!",
    });
  };

  return {
    createFolderHandle,
    createCardHandle,
  };
};

export function Files({ workspace }: FilesProps) {
  const { createFolderHandle, createCardHandle } = useFiles();

  return (
    <div className="w-full">
      <div className="w-full max-w-main mx-auto flex flex-col gap-1">
        <header className="justify-between flex w-full items-center gap-4 rounded-lg">
          <div className="flex gap-3 items-center cursor-default text-gray-500 font-semibold">
            <IoGrid />
            <span className={fontSaira}>Espaços</span>
          </div>
        </header>

        <section className="flex flex-wrap w-full mt-3 gap-2">
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
          <button
            type="button"
            onClick={createFolderHandle}
            className="w-[8rem] h-[8rem] mx-1 group/link mb-2 grid place-items-center opacity-90 hover:opacity-100 overflow-hidden rounded-lg bg-zinc-50 dark:bg-zinc-900 dark:border-zinc-800 border-2 dark:border-dashed border-dashed "
          >
            <span>
              <IoAddCircle size={40} className="text-zinc-600" />
            </span>
          </button>
        </section>
      </div>

      <div className="w-full max-w-main mx-auto flex flex-col gap-1 mt-10">
        <header className="justify-between flex w-full items-center gap-4 rounded-lg">
          <div className="flex gap-3 items-center cursor-default text-gray-500 font-semibold">
            <MdOutlineDriveFileRenameOutline />
            <span className={fontSaira}>Arquivos</span>
          </div>
        </header>

        <section className="flex flex-wrap w-full mt-3 gap-2">
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

          <button
            onClick={createCardHandle}
            type="button"
            className="w-[8rem] h-[8rem] mx-1 group/link mb-2 grid place-items-center opacity-90 hover:opacity-100 overflow-hidden rounded-lg bg-zinc-50 dark:bg-zinc-900 dark:border-zinc-800 border-2 dark:border-dashed border-dashed "
          >
            <span>
              <IoAddCircle size={40} className="text-zinc-600" />
            </span>
          </button>
        </section>
      </div>
    </div>
  );
}
