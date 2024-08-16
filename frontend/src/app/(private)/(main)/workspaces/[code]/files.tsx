import { fontFiraCode } from "@/fonts";
import { Workspace } from "@/interfaces/IWorkspace";
import { IoGrid } from "react-icons/io5";
import { motion } from "framer-motion";
import { BiPlus } from "react-icons/bi";
import { TbFolderPlus } from "react-icons/tb";

type FilesProps = {
  workspace: Workspace;
};

export function Files({ workspace }: FilesProps) {
  return (
    <div className="w-full my-5">
      <div className="w-full max-w-main mx-auto flex flex-col gap-1">
        <header className="justify-between flex w-full items-center gap-4 bg-zinc-100 dark:bg-zinc-800 p-2 rounded-lg shadow dark:shadow-xl dark:shadow-black">
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
          {workspace?.workspaces?.map(workspace => (
            <motion.div
              // whileHover={{ scale: 1.1 }}
              className="w-full max-w-[12rem] mr-[-0.5rem] mb-2 rotate hover:mr-[0.3rem] skew-y-1 transition-all h-auto overflow-hidden min-h-[12rem] rounded-md bg-zinc-100 dark:bg-zinc-800 shadow-md dark:shadow-black border border-transparent dark:border-zinc-700 dark:border-opacity-60"
            >
              <div className="bg-indigo-600 h-[50%]">{/* Image */}</div>
              <div className="p-2 font-semibold text-zinc-500">
                {workspace?.name}
              </div>
            </motion.div>
          ))}
        </section>
      </div>
    </div>
  );
}
