import { HTMLMotionProps } from "framer-motion";
import { twMerge } from "tailwind-merge";
import { motion } from "framer-motion";
import Link from "next/link";
import { IoClose, IoTrash } from "react-icons/io5";
import { fontFiraCode } from "@/fonts";
import { api } from "@/api";
import { toast } from "react-toastify";
import { queryClient } from "@/providers/query-client";
import { useRouter } from "next/navigation";

interface DetailsTasksProps extends HTMLMotionProps<"div"> {
  taskId: string;
}

const useDetailsTasks = () => {
  const router = useRouter();

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
    deleteTask,
  };
};

export function DetailsTasks(props: DetailsTasksProps) {
  const { deleteTask } = useDetailsTasks();
  const { taskId } = props;

  return (
    <div className="min-w-[30rem] fixed top-0 left-0 w-full h-screen bg-black/10 backdrop-blur-md flex flex-col px-0 p-1 z-20">
      <motion.div
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="w-full max-w-[50rem] mx-auto relative mt-[10rem] rounded-xl flex flex-col overflow-auto bg-gray-50 dark:bg-zinc-900/80"
      >
        <header className="w-full flex p-5 justify-between items-center gap-5">
          <div className={`flex items-center flex-1 gap-5 ${fontFiraCode}`}>
            <input
              className="text-zinc-500 dark:text-zinc-300 text-xl font-semibold bg-transparent rounded flex-1 outline-none"
              type="text"
              placeholder="Digite um nome para a task..."
              defaultValue={"Exemplo de task"}
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
          <label htmlFor="name"></label>
        </section>

        <footer className="flex gap-2 px-5 pb-5 items-center justify-between ">
          <button
            type="button"
            onClick={() => deleteTask(taskId)}
            className="bg-zinc-200 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400 items-center gap-2 flex opacity-90 hover:opacity-100 p-1 px-2 rounded"
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
