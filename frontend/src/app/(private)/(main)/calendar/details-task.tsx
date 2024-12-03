import { FormTask } from "@/components/form-task";
import { LoaderLogo } from "@/components/loader-logo";
import { fontSaira } from "@/fonts";
import { useDetailsTasks } from "@/hooks/use-details-tasks";
import { HTMLMotionProps, motion } from "framer-motion";
import Link from "next/link";
import { FaPen, FaTrash } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { MdModeComment } from "react-icons/md";
import { TbFileFilled } from "react-icons/tb";

interface DetailsTasksProps extends HTMLMotionProps<"div"> {
  taskId: string;
}

export function DetailsTasks(props: DetailsTasksProps) {
  const { taskId } = props;
  const details = useDetailsTasks({ taskId });
  const { deleteTask, updateTask, isLoading, task } = details;

  if (isLoading) return <LoaderLogo />;

  return (
    <div className="fixed top-0 left-0 w-full scroll-default h-screen bg-zinc-950/70 flex flex-col px-0 p-1 z-20 overflow-auto">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full flex-row max-w-[45rem] mx-auto relative mt-0 mb-0 lg:mt-[5rem] lg:mb-[5rem] rounded-xl flex bg-gray-100 dark:bg-neutral-900 backdrop-blur-md"
      >
        {task && (
          <FormTask.Container task={task} handleSubmit={updateTask}>
            <FormTask.Header />
            <FormTask.Section />
            <FormTask.Footer className={`border-none mb-8 py-0 ${fontSaira}`}>
              <button
                type="submit"
                className="bg-indigo-600 ml-5 text-sm text-white opacity-90 hover:opacity-100 p-2 px-3 rounded shadow-md"
              >
                Salvar alterações
              </button>
            </FormTask.Footer>
          </FormTask.Container>
        )}

        <section className="flex py-4 flex-col min-w-[12rem] gap-2 px-4 border-l-4 border-gray-400 dark:border-zinc-800">
          <Link
            href={"?"}
            className="w-8 h-8 bg-white shadow hover:shadow-lg transition justify-self-end self-end grid place-items-center rounded opacity-90 hover:opacity-100 dark:bg-zinc-800"
          >
            <IoClose />
          </Link>

          <div className="flex flex-col gap-3 mt-5 flex-1">
            <button className="bg-gray-200 border-2 border-indigo-600 cursor-default flex items-center text-gray-500 dark:text-gray-300 justify-between dark:bg-neutral-800 rounded-md opacity-90 hover:opacity-100 p-1 px-2">
              <span className={fontSaira}>Editar</span>
              <FaPen size={14} />
            </button>

            <button className="bg-gray-200 flex items-center text-gray-500 dark:text-gray-300 justify-between dark:bg-neutral-800 rounded-md opacity-90 hover:opacity-100 p-1 px-2">
              <span className={fontSaira}>Comentários</span>
              <MdModeComment />
            </button>

            <button className="bg-gray-200 flex items-center text-gray-500 dark:text-gray-300 justify-between dark:bg-neutral-800 rounded-md opacity-90 hover:opacity-100 p-1 px-2">
              <span className={fontSaira}>Arquivos</span>
              <TbFileFilled />
            </button>
          </div>

          <button
            onClick={() => deleteTask(taskId)}
            className="bg-gray-200 flex items-center text-gray-500 dark:text-gray-300 justify-between dark:bg-neutral-800 rounded-md opacity-90 hover:opacity-100 p-1 px-2"
          >
            <span className={fontSaira}>Lixeira</span>
            <FaTrash size={12} />
          </button>
        </section>
      </motion.div>
    </div>
  );
}
