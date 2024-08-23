"use client";

import { fontRoboto } from "@/fonts";
import { FaLock } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { useLogin } from "./hooks";
import Link from "next/link";

export default function Page() {
  const { form, auth } = useLogin();
  const { handleSubmit, formState, register,} = form;
  const { isSubmitting } = formState;

  return (
    <form
      onSubmit={handleSubmit(auth)}
      className="w-[99%] max-w-[25rem] border p-6 m-auto rounded bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:bg-opacity-80 flex flex-col gap-5 z-20"
    >
      <header className="dark:text-zinc-400 text-zinc-700 cursor-default">
        <h1 className={`${fontRoboto} text-lg`}>Flards</h1>
      </header>
      <section className="w-full flex flex-col gap-3">
        <label htmlFor="email" className="w-full flex flex-col gap-1">
          <span className="">Email</span>
          <div className="flex w-full items-center transition-all border bg-white dark:bg-transparent dark:border-zinc-800 rounded ring-indigo-600 focus-within:ring-2">
            <MdEmail className="text-zinc-700 w-10" size={20} />
            <input
              type="text"
              {...register("email")}
              placeholder="jonhDoe@example.com.br"
              className="p-2 rounded bg-transparent outline-none flex-1 "
            />
          </div>
        </label>
        <label htmlFor="password" className="w-full flex flex-col gap-1">
          <span className="">Password</span>
          <div className="flex w-full items-center transition-all border bg-white dark:bg-transparent dark:border-zinc-800 rounded ring-indigo-600 focus-within:ring-2">
            <FaLock className="text-zinc-700 min-w-10" size={16} />
            <input
              type="password"
              {...register("password")}
              placeholder="••••••••••"
              className="p-2 rounded bg-transparent outline-none w-full"
            />
            <Link
              href={"#"}
              className="px-1 pr-2 flex opacity-90 hover:opacity-100 whitespace-nowrap text-sm font-semibold text-violet-500"
            >
              Reset password
            </Link>
          </div>
        </label>
      </section>
      <footer className="w-full">
        <button
          type="submit"
          style={{ opacity: isSubmitting ? 0.6 : 0.9 }}
          className="w-full bg-indigo-600 p-2 rounded opacity-90 hover:opacity-100 text-white"
        >
          Login
        </button>
      </footer>
    </form>
  );
}
