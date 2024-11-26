import { FormTask } from "@/components/form-task";
import { LoaderLogo } from "@/components/loader-logo";
import { useDetailsTasks } from "@/hooks/use-details-tasks";
import { HTMLMotionProps, motion } from "framer-motion";
import Link from "next/link";
import { IoClose, IoTrash } from "react-icons/io5";

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
        className="w-full max-w-[40rem] mx-auto relative mt-0 mb-0 lg:mt-[5rem] lg:mb-[5rem] rounded-xl flex flex-col bg-gray-100 dark:bg-neutral-900 backdrop-blur-md"
      >
        {task && (
          <FormTask.Container task={task} handleSubmit={updateTask}>
            <FormTask.Header>
              <Link
                href={"?"}
                className="w-8 h-8 bg-white shadow grid place-items-center rounded opacity-90 hover:opacity-100 dark:bg-zinc-800"
              >
                <IoClose />
              </Link>
            </FormTask.Header>
            <FormTask.Section />
            <FormTask.Footer>
              <button
                type="button"
                onClick={() => deleteTask(taskId)}
                className="bg-white shadow text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400 items-center gap-2 flex opacity-90 hover:opacity-100 p-1 px-2 rounded"
              >
                <IoTrash size={18} />
                Delete
              </button>

              <button
                type="submit"
                className="bg-indigo-600 text-white opacity-90 hover:opacity-100 p-2 text-base px-3 rounded shadow-md"
              >
                Go
              </button>
            </FormTask.Footer>
          </FormTask.Container>
        )}
      </motion.div>
    </div>
  );
}
