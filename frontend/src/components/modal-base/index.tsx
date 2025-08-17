import { fontOpenSans } from "@/fonts";
import { useClickOutside } from "@/hooks/use-click-outside";
import { HTMLMotionProps, motion, MotionProps } from "framer-motion";
import { useRouter } from "next/navigation";
import React, { HTMLAttributes } from "react";
import { IoClose } from "react-icons/io5";
import { twMerge } from "tailwind-merge";

const animations = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
} satisfies MotionProps;

interface ModalFormProps extends HTMLMotionProps<"form"> {
  children: React.ReactNode;
}

interface ModalDivProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
}

const ModalContainer = (props: HTMLMotionProps<"div">) => {
  const { className, ...rest } = props;

  const style = twMerge(
    "flex fixed top-0 w-full left-0 h-screen z-40 bg-white/10 dark:bg-black/60 text-zinc-500 overflow-auto p-3",
    className
  );

  return (
    <motion.div
      className={style}
      {...rest}
      variants={animations}
      initial="initial"
      transition={{ duration: 0.1 }}
      animate="animate"
      style={{ perspective: "1000px" }}
      exit="exit"
    >
      {props.children}
    </motion.div>
  );
};

export const ModalForm = (props: ModalFormProps) => {
  const { className, children, ...rest } = props;
  const classStyle = twMerge(
    "flex flex-col m-auto bg-white border border-indigo-50 text-zinc-500 dark:text-white dark:bg-zinc-800 border dark:border-zinc-800 rounded-md w-full max-w-[30rem] will-change-transform",
    className
  );

  const router = useRouter();

  const ref = useClickOutside<HTMLFormElement>(() => {
    router.push("?");
  });

  return (
    <motion.form
      ref={ref}
      initial={{ scale: 0.8, rotateY: 100, opacity: 0.8 }}
      animate={{ scale: 1, opacity: 1, rotateY: 0 }}
      exit={{ scale: 0.8, rotateY: 10, opacity: 0.6 }}
      transition={{
        duration: 0.1,
        type: "tween",
        filter: { duration: 0.1 },
      }}
      {...rest}
      className={classStyle}
    >
      {children}
    </motion.form>
  );
};

export const ModalDiv = (props: ModalDivProps) => {
  const { className, children, ...rest } = props;

  const classStyle = twMerge(
    "flex flex-col m-auto bg-white border border-indigo-50 text-zinc-500 dark:text-white dark:bg-zinc-900 border dark:border-zinc-800 rounded-md w-full max-w-[30rem] h-auto",
    className
  );

  const router = useRouter();

  const ref = useClickOutside<HTMLDivElement>(() => {
    router.push("?");
  });

  return (
    <motion.div
      ref={ref}
      initial={{ scale: 0.3, rotateY: 40, opacity: 0.8, }}
      animate={{ scale: 1, opacity: 1, rotateY: 0, rotateX: 0 }}
      exit={{ scale: 0.8, rotateY: 10, opacity: 0.6 }}
      transition={{
        duration: 0.1,
        type: "tween",
        filter: { duration: 0.1 },
      }}
      {...rest}
      className={classStyle}
    >
      {children}
    </motion.div>
  );
};

const Close = ({ closeFn }: { closeFn?: () => void }) => {
  const router = useRouter();

  const close = () => {
    if (!!closeFn) {
      closeFn();
    } else {
      router.push("?");
    }
  };

  return (
    <button
      type="button"
      onClick={close}
      className="w-8 h-8 hover:bg-zinc-100 dark:hover:bg-zinc-800 grid place-items-center rounded-lg"
    >
      <IoClose size={20} />
    </button>
  );
};

const ModalHeader = (
  props: HTMLAttributes<HTMLDivElement> & {
    title: string;
    closeFn?: () => void;
  }
) => {
  const { title, className, closeFn, ...rest } = props;
  const classStyle = twMerge("flex justify-between w-full", className);

  return (
    <header className={classStyle} {...rest}>
      <h1 className={`${fontOpenSans}`}>{title}</h1>
      <Close closeFn={closeFn} />
    </header>
  );
};

const Modal = {
  container: ModalContainer,
  box: ModalDiv,
  form: ModalForm,
  header: ModalHeader,
  close: Close,
};

export { Modal };
