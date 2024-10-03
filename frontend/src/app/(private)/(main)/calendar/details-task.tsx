import { HTMLMotionProps } from "framer-motion";
import { twMerge } from "tailwind-merge";
import { motion } from "framer-motion";
import Link from "next/link";
import { IoClose } from "react-icons/io5";

interface DetailsTasksProps extends HTMLMotionProps<"div"> {
  taskId: string;
}

export function DetailsTasks(props: DetailsTasksProps) {
  const { taskId, className } = props;
  const style = twMerge("", className);

  return (
    <motion.div className="min-w-[30rem] flex flex-col px-0 p-1 z-20">
      <div className="w-full sticky top-[1rem] rounded-lg flex flex-col overflow-auto bg-gray-50 dark:bg-zinc-900/80 border-l dark:border-zinc-800/50 border-r">
        <header className="w-full flex p-3 justify-between items-center">
          <div className="flex gap-2 items-center">
            <span className="text-zinc-500 dark:text-zinc-300 font-semibold">
              Task de exemplo
            </span>
          </div>
          <Link
            href={"?"}
            className="w-8 h-8 bg-white shadow grid place-items-center rounded opacity-90 hover:opacity-100 dark:bg-zinc-800"
          >
            <IoClose />
          </Link>
        </header>

        <span className="w-full h-1 bg-gray-200/50 dark:bg-zinc-800" />

        <section className="flex flex-col gap-2 p-3">
          <label htmlFor=""></label>
        </section>
      </div>
    </motion.div>
  );
}
