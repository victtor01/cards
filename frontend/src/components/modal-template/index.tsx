import { fontOpenSans } from "@/fonts";
import { motion, MotionProps } from "framer-motion";
import Link from "next/link";
import { HTMLAttributes } from "react";
import { IoClose } from "react-icons/io5";
import { twMerge } from "tailwind-merge";

interface ModalProps extends HTMLAttributes<HTMLDivElement> {
  title: string;
  zIndex?: number;
}

const animations = {
  initial: {
    opacity: 0,
    y: -200,
  },
  animate: {
    opacity: 1,
    y: 0,
  },
} satisfies MotionProps;

export function Modal({ children, title, className }: ModalProps) {
  const style = twMerge(
    "flex m-auto w-full max-w-[30rem] bg-zinc-50 dark:bg-zinc-900 rounded-xl flex-col shadow-lg dark:shadow-black h-auto",
    className
  );

  return (
    <motion.div className="scroll-default flex-col flex w-full h-screen fixed z-50 top-0 p-5 left-0 bg-black/50 dark:bg-black bg-opacity-5 dark:bg-opacity-70 backdrop-blur-sm overflow-auto">
      <motion.div
        variants={animations}
        initial="initial"
        animate="animate"
        exit="initial"
        className={style}
      >
        <header className="w-full p-3 px-5 flex justify-between items-center">
          <div
            className={`${fontOpenSans} text-zinc-600 dark:text-zinc-300 font-semibold capitalize`}
          >
            <h1 className="text-lg">{title}</h1>
          </div>
          <div>
            <Link
              href="?"
              className="w-8 h-8 bg-white dark:bg-zinc-800 rounded opacity-70 hover:opacity-100 grid place-items-center shadow"
            >
              <IoClose />
            </Link>
          </div>
        </header>

        {children}
      </motion.div>
    </motion.div>
  );
}
