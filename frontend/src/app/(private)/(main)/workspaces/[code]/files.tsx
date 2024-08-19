import { fontFiraCode } from "@/fonts";
import { Workspace } from "@/interfaces/IWorkspace";
import { IoGrid } from "react-icons/io5";
import { BiPlus } from "react-icons/bi";
import { TbFolderPlus } from "react-icons/tb";
import Link from "next/link";
import Image from "next/image";
import { getUpload } from "@/utils/get-upload";

type FilesProps = {
  workspace: Workspace;
};

export function Files({ workspace }: FilesProps) {
  return (
    <div className="w-full my-5">
      <div className="w-full max-w-main mx-auto flex flex-col gap-1">
        <header className="justify-between flex w-full items-center gap-4 bg-zinc-100 dark:bg-zinc-800 p-2 rounded-lg shadow dark:shadow-black">
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
          {workspace?.workspaces?.map((workspace) => {
            const backgroundImage = getUpload(workspace?.background);
            return (
              <Link
                key={workspace.code}
                href={`/workspaces/${workspace.code}`}
                className="w-full max-w-[12rem] mr-[-0.5rem] hover:translate-x-[-0.7rem] mb-2 rotate opacity-90 hover:opacity-100 skew-y-1 hover:skew-y-0 transition-all h-auto overflow-hidden min-h-[12rem] rounded-xl bg-zinc-100 dark:bg-zinc-800 shadow-md dark:shadow-black border border-transparent dark:border-zinc-700 dark:border-opacity-60"
              >
                <div className="bg-indigo-600 h-[50%] relative">
                  {backgroundImage && (
                    <Image
                      quality={1}
                      src={backgroundImage}
                      alt="background"
                      objectFit="cover"
                      fill
                    />
                  )}
                </div>
                <div className="p-2 font-semibold text-zinc-500">
                  {workspace?.name}
                </div>
              </Link>
            );
          })}
        </section>
      </div>
    </div>
  );
}
