import { FormTask } from "@/components/form-task";
import { LoaderLogo } from "@/components/loader-logo";
import { fontSaira } from "@/fonts";
import { useDetailsTasks } from "@/hooks/use-details-tasks";
import { ITask } from "@/interfaces/ITask";
import { TaskSchema } from "@/schemas/task-schema";
import { HTMLMotionProps, motion } from "framer-motion";
import Link from "next/link";
import { HtmlHTMLAttributes, useState } from "react";
import { FaPen, FaTrash } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { MdModeComment } from "react-icons/md";
import { TbFileFilled } from "react-icons/tb";

interface DetailsTasksProps extends HTMLMotionProps<"div"> {
  taskId: string;
}

interface LinksProps extends HtmlHTMLAttributes<HTMLDivElement> {
  handlePage: (page: PageState) => void;
  page: PageState;
}

type PageState = "edit" | "comments" | "files";

type FormProps = {
  updateTask: (data: TaskSchema) => Promise<void>;
  task: ITask;
};

const keysOfPageState = ["edit", "comments", "files"];

const useStatesOfDetailsTasks = () => {
  const [page, setPage] = useState<PageState>("edit");
  const handlePage = (page: PageState) => setPage(page);

  return {
    page,
    handlePage,
  };
};

function Form({ task, updateTask }: FormProps) {
  return (
    <FormTask.Container
      handleSubmit={updateTask}
      className="flex-1"
      task={task}
    >
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
  );
}

function NavBar({ page, handlePage, children }: LinksProps) {
  const styleSelected =
    "shadow-xl bg-white dark:bg-neutral-700 opacity-100 cursor-default";

  const keysOfPageState: Record<PageState, any> = {
    edit: { name: "editar", icon: <FaPen size={14} /> },
    comments: { name: "Comentários", icon: <MdModeComment /> },
    files: { name: "Arquivos", icon: <TbFileFilled /> },
  };

  return (
    <section className="flex py-4 flex-col min-w-[12rem] gap-2 px-4 border-l-4 border-gray-200 dark:border-zinc-800">
      <Link
        href={"?"}
        className="w-8 h-8 bg-white shadow hover:shadow-lg transition justify-self-end self-end grid place-items-center rounded opacity-90 hover:opacity-100 dark:bg-zinc-800"
      >
        <IoClose />
      </Link>

      <div className="flex flex-col gap-3 mt-5 flex-1">
        {Object.entries(keysOfPageState)?.map(([key, value]) => {
          const selectedStyle = page === key ? styleSelected : "";
          return (
            <button
              key={key}
              type="button"
              onClick={() => handlePage(key as PageState)}
              className={`${selectedStyle} bg-gray-200 transition-all flex items-center text-gray-500 dark:text-gray-300 justify-between dark:bg-neutral-800 rounded-md opacity-90 hover:opacity-100 p-1 px-2`}
            >
              <span className={fontSaira}>{value.name}</span>
              {value.icon}
            </button>
          );
        })}
      </div>

      {children}
    </section>
  );
}

export function DetailsTasks({ taskId }: DetailsTasksProps) {
  const details = useDetailsTasks({ taskId });
  const { deleteTask, updateTask, isLoading, task } = details;
  const { page, handlePage } = useStatesOfDetailsTasks();

  const deleteTaskEvent = () => deleteTask(taskId);

  if (isLoading) return <LoaderLogo />;
  if (!task) return;

  const componentsOfLinks: Record<PageState, React.ReactNode> = {
    edit: <Form task={task} updateTask={updateTask} />,
    comments: <div className="flex flex-1"></div>,
    files: <div></div>,
  };

  const render = componentsOfLinks[page];

  return (
    <div className="fixed top-0 left-0 w-full scroll-default h-screen bg-zinc-950/70 flex flex-col px-0 p-1 z-20 overflow-auto">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full flex-row max-w-[45rem] mx-auto relative mt-0 mb-0 lg:mt-[5rem] lg:mb-[5rem] rounded-xl flex bg-gray-100 dark:bg-neutral-900 backdrop-blur-md"
      >
        {render}

        <NavBar page={page} handlePage={handlePage}>
          <button
            onClick={deleteTaskEvent}
            className="bg-gray-200 flex items-center text-gray-500 dark:text-gray-300 justify-between dark:bg-neutral-800 rounded-md opacity-90 hover:opacity-100 p-1 px-2"
          >
            <span className={fontSaira}>Lixeira</span>
            <FaTrash size={12} />
          </button>
        </NavBar>
      </motion.div>
    </div>
  );
}
