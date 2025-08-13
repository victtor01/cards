import { FormTask } from "@/components/form-task";
import { LoaderLogo } from "@/components/loader-logo";
import { Modal } from "@/components/modal-template";
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

const keysOfPageState: Record<PageState, any> = {
  edit: { name: "editar", icon: <FaPen size={14} /> },
  comments: { name: "Comentários", icon: <MdModeComment /> },
  files: { name: "Arquivos", icon: <TbFileFilled /> },
};

function NavBar({ page, handlePage, children }: LinksProps) {
  const styleSelected =
    "shadow-xl bg-white dark:bg-neutral-700 opacity-100 cursor-default";


  return (
    <section className="flex py-4 flex-col min-w-[15rem] gap-2 px-4 border-l-2 bg-gray-50 dark:bg-zinc-900 rounded-xl dark:border-zinc-800">
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
    files: <div className="flex flex-1"></div>,
  };

  const render = componentsOfLinks[page];

  return (
    <Modal.Container className="flex flex-row gap-4 w-full max-w-[70rem] mt-[4rem]">
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
    </Modal.Container>
  );
}
