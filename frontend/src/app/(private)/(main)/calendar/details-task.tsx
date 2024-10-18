import { api } from "@/api";
import { FormTask } from "@/components/form-task";
import { LoaderLogo } from "@/components/loader-logo";
import { ITask } from "@/interfaces/ITask";
import { queryClient } from "@/providers/query-client";
import { TaskSchema } from "@/schemas/task-schema";
import { useQuery } from "@tanstack/react-query";
import { HTMLMotionProps, motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { IoClose, IoTrash } from "react-icons/io5";
import { toast } from "react-toastify";

interface DetailsTasksProps extends HTMLMotionProps<"div"> {
  taskId: string;
}

type useDetailsTasksProps = {
  taskId: string;
};

const useDetailsTasks = ({ taskId }: useDetailsTasksProps) => {
  const router = useRouter();

  const { data: task, isLoading } = useQuery<ITask>({
    queryKey: ["task", taskId],
    queryFn: async () => (await api.get(`/tasks/${taskId}`)).data,
  });

  const deleteTask = async (taskId: string) => {
    try {
      await api.delete(`/tasks/${taskId}`);
      await queryClient.refetchQueries({ queryKey: ["tasks"] });
      toast.success("Task deletada com sucesso!");
    } catch (error) {
      toast.error("Houve um erro ao excluir task!");
    } finally {
      router.push("?");
    }
  };

  const updateTask = (data: TaskSchema) => {
    console.log(data);
  };

  return {
    updateTask,
    isLoading,
    deleteTask,
    task,
  };
};

export function DetailsTasks(props: DetailsTasksProps) {
  const { taskId } = props;
  const { deleteTask, updateTask, isLoading, task } = useDetailsTasks({
    taskId,
  });

  if (isLoading) return <LoaderLogo />;

  return (
    <div className="min-w-[30rem] fixed top-0 left-0 w-full h-screen bg-black/50 flex flex-col px-0 p-1 z-20 overflow-auto">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[45rem] mx-auto relative mt-[10rem] mb-[10rem] rounded-xl flex flex-col bg-gray-100 dark:bg-neutral-900/80 backdrop-blur-md"
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
