import { HTMLAttributes } from "react";
import { twMerge } from "tailwind-merge";

export interface LoaderProps extends HTMLAttributes<HTMLDivElement> {}

export function Loader(props: LoaderProps) {
  const classname = twMerge(
    "w-10 h-10 rounded-full inline-block border-t-2 border-r-2 border-t-zinc-500 dark:border-t-zinc-200 border-r-transparent box-border animate-spin",
    props.className
  );
  return <div className={classname} />;
}
