import { api } from "@/api";
import { fontFiraCode } from "@/fonts";
import { queryClient } from "@/providers/query-client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { HTMLMotionProps, motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { IoClose, IoTrash } from "react-icons/io5";
import { toast } from "react-toastify";
import { taskSchema, TaskSchema } from "@/schemas/task-schema";
import { LoaderLogo } from "@/components/loader-logo";
import { ITask } from "@/interfaces/ITask";
import TextareaAutosize from "react-textarea-autosize";

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

  const form = useForm<TaskSchema>({
    resolver: zodResolver(taskSchema),
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

  return {
    form,
    isLoading,
    deleteTask,
    task,
  };
};

export function DetailsTasks(props: DetailsTasksProps) {
  const { taskId } = props;
  const { deleteTask, form, isLoading, task } = useDetailsTasks({ taskId });
  const { register, watch } = form;
  const description = watch("description");

  if (isLoading) return <LoaderLogo />;

  return (
    <div className="min-w-[30rem] fixed top-0 left-0 w-full h-screen bg-black/50 flex flex-col px-0 p-1 z-20 overflow-auto">
      <motion.div className="w-full max-w-[50rem] mx-auto relative mt-[10rem] mb-[10rem] rounded-xl flex flex-col bg-gray-100 dark:bg-zinc-900/80 backdrop-blur-md">
        <header className="w-full flex p-5 justify-between items-center gap-5">
          <div className={`flex items-center flex-1 gap-5 ${fontFiraCode}`}>
            <input
              {...register("name")}
              defaultValue={task?.name}
              className="text-zinc-500 dark:text-zinc-300 text-xl font-semibold bg-transparent rounded flex-1 outline-none"
              type="text"
              placeholder="Digite um nome para a task..."
            />
          </div>
          <Link
            href={"?"}
            className="w-8 h-8 bg-white shadow grid place-items-center rounded opacity-90 hover:opacity-100 dark:bg-zinc-800"
          >
            <IoClose />
          </Link>
        </header>

        <section className="flex flex-col gap-2 px-5">
          <label htmlFor="name" className="flex flex-col gap-1">
            <div className="flex justify-between items-center">
              <b>Descrição</b>
              <span>{255 - (description?.length || 0)}</span>
            </div>
            <TextareaAutosize
              {...register("description")}
              maxLength={255}
              defaultValue={task?.description ?? ""}
              className={` bg-white dark:bg-neutral-800 rounded-md resize-none text-lg text-gray-600 font-semibold dark:text-zinc-300 max-h-[15rem] p-2 shadow outline-none border-b-4 border-indigo-600`}
              placeholder="Digite uma descrição para task"
            />
          </label>
        </section>

        <footer className="flex gap-2 px-5 pb-5 items-center justify-between mt-4">
          <button
            type="button"
            onClick={() => deleteTask(taskId)}
            className="bg-white shadow text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400 items-center gap-2 flex opacity-90 hover:opacity-100 p-1 px-2 rounded"
          >
            <IoTrash size={18} />
            Delete
          </button>

          <button
            onClick={() => deleteTask(taskId)}
            className="bg-indigo-600 text-white opacity-90 hover:opacity-100 p-2 text-base px-3 rounded shadow-md"
          >
            Go
          </button>
        </footer>
      </motion.div>
    </div>
  );
}
