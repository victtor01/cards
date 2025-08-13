import LinkComponent from "@/components/link-component";
import { fontSaira } from "@/fonts";
import { useActionsWorkspaces } from "@/hooks/use-workspace";
import { IWorkspace } from "@/interfaces/IWorkspace";
import { useParams } from "next/navigation";
import { AiFillEdit } from "react-icons/ai";
import { BiSolidMessageSquareEdit } from "react-icons/bi";
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
      <div className="w-full max-w-main mx-auto flex flex-col gap-1 bg-white p-3 rounded-xl dark:bg-zinc-900">
        <header className="justify-between items-start flex w-full gap-4 rounded-lg">
          <div className="flex gap-3 items-center cursor-default text-gray-500 font-semibold">
            <IoGrid />
            <span className={fontSaira}>Espaços</span>
          </div>
          <div className="p-1 px-3 bg-white dark:bg-zinc-800 dark:border-zinc-700 rounded-md border pointer-events-none">
            <span className={`${fontSaira} text-gray-500 dark:text-zinc-200`}>
              {workspace?.workspaces?.length || 0} / 20
            </span>
          </div>
        </header>

        <section className="flex flex-wrap  w-full mt-3 gap-2">
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

          {workspace?.workspaces?.length > 0 && (
            <button
              type="button"
              onClick={createFolderHandle}
              className="w-[8rem] h-[8rem] mx-1 group/link mb-2 grid place-items-center opacity-90 hover:opacity-100 overflow-hidden rounded-lg bg-zinc-50 dark:bg-zinc-900 dark:border-zinc-800 border-2 dark:border-dashed border-dashed "
            >
              <span>
                <IoAddCircle size={40} className="text-zinc-600" />
              </span>
            </button>
          )}

          {!workspace?.workspaces?.length && (
            <div className="flex p-4 flex-1">
              <div className="flex gap-4 m-auto flex-col text-center items-center justify-center">
                <IoGrid
                  size={50}
                  className="text-indigo-500 drop-shadow-[0_8px_5px_var(--indigo)]"
                />

                <span
                  className={`${fontSaira} font-semibold text-gray-500 dark:text-gray-200 text-lg`}
                >
                  Crie seu primeiro espaço!
                </span>

                <button
                  type="button"
                  onClick={createFolderHandle}
                  className="flex p-2 px-6 font-semibold rounded-xl bg-indigo-500 transition-all text-md hover:bg-indigo-600 text-indigo-50"
                >
                  <span className={fontSaira}>Criar</span>
                </button>
              </div>
            </div>
          )}
        </section>
      </div>

      <div className="w-full max-w-main mx-auto mb-20 flex flex-col mt-5 gap-1 bg-white p-3 rounded-xl dark:bg-zinc-900">
        <header className="justify-between items-start flex w-full gap-4 rounded-lg">
          <div className="flex gap-3 items-center cursor-default text-gray-500 font-semibold">
            <MdOutlineDriveFileRenameOutline />
            <span className={fontSaira}>Arquivos</span>
          </div>
          <div className="p-1 px-3 bg-white dark:bg-zinc-800 dark:border-zinc-700 rounded-md border pointer-events-none">
            <span className={`${fontSaira} text-gray-500 dark:text-zinc-200`}>
              {workspace?.workspaces?.length || 0} / 20
            </span>
          </div>
        </header>

        <section className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 2xl:flex 2xl:flex-wrap w-full mt-3 gap-2">
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

          {!!workspace?.cards?.length && (
            <button
              onClick={createCardHandle}
              type="button"
              className="w-[8rem] h-[8rem] mx-1 group/link mb-2 grid place-items-center opacity-90 hover:opacity-100 overflow-hidden rounded-lg bg-zinc-50 dark:bg-zinc-900 dark:border-zinc-800 border-2 dark:border-dashed border-dashed "
            >
              <span>
                <IoAddCircle size={40} className="text-zinc-600" />
              </span>
            </button>
          )}

          {!workspace?.cards?.length && (
            <div className="flex p-4 flex-1">
              <div className="flex gap-4 m-auto flex-col text-center items-center justify-center">
                <BiSolidMessageSquareEdit
                  size={50}
                  className="text-indigo-500 drop-shadow-[0_8px_5px_var(--indigo)]"
                />

                <span
                  className={`${fontSaira} font-semibold text-gray-500 dark:text-gray-200 text-lg`}
                >
                  Que tal um documento?
                </span>

                <button
                  onClick={createCardHandle}
                  type="button"
                  className="flex p-2 px-6 font-semibold rounded-xl bg-indigo-500 transition-all text-md hover:bg-indigo-600 text-indigo-50"
                >
                  <span className={fontSaira}>Novo</span>
                </button>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
