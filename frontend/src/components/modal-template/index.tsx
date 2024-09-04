import { fontOpenSans } from "@/fonts";
import { IoClose } from "react-icons/io5";
import { motion, MotionProps } from "framer-motion";
import Link from "next/link";

type ModalProps = {
  children: React.ReactNode;
  title: string;
};

const animations = {
  initial: {
    opacity: 0,
    scale: 0,
  },
  animate: {
    opacity: 1,
    scale: 1,
  },
} satisfies MotionProps;

export function Modal({ children, title }: ModalProps) {
  return (
    <motion.div className="flex w-full h-screen fixed top-0 p-5 left-0 z-30 bg-zinc-100 dark:bg-black bg-opacity-5 dark:bg-opacity-70 backdrop-blur-sm overflow-auto">
      <motion.div
        variants={animations}
        initial="initial"
        animate="animate"
        exit="initial"
        className="flex m-auto w-full max-w-[30rem] bg-zinc-50 dark:bg-zinc-900 rounded-xl flex-col overflow-hidden shadow-lg dark:shadow-black"
      >
        <header className="w-full p-5 flex justify-between items-center">
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
