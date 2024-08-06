"use client";

import { fontRoboto } from "@/fonts";
import { FaLock } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { useLogin } from "./hooks";

export default function Page() {
  const { form, auth } = useLogin();
  const { handleSubmit, formState, register } = form;
  const { errors, isSubmitting } = formState;

  return (
    <form
      onSubmit={handleSubmit(auth)}
      className="w-[99%] max-w-[25rem] border p-5 m-auto rounded border-zinc-800 bg-zinc-900 flex flex-col gap-5"
    >
      <header className="text-zinc-400 cursor-default">
        <h1 className={`${fontRoboto} text-lg`}>Flards</h1>
      </header>
      <section className="w-full flex flex-col gap-3">
        <label htmlFor="email" className="w-full flex flex-col gap-1">
          <span className="">Email</span>
          <div className="flex w-full items-center transition-all border border-zinc-800 rounded ring-indigo-600 focus-within:ring-2">
            <input
              type="text"
              {...register("email")}
              placeholder="jonhDoe@example.com.br"
              className="p-2 rounded bg-transparent outline-none flex-1 "
            />
            <MdEmail className="text-zinc-700 w-10" size={20} />
          </div>
        </label>
        <label htmlFor="password" className="w-full flex flex-col gap-1">
          <span className="">Password</span>
          <div className="flex w-full items-center transition-all border border-zinc-800 rounded ring-indigo-600 focus-within:ring-2">
            <input
              type="password"
              {...register("password")}
              placeholder="••••••••••"
              className="p-2 rounded bg-transparent outline-none flex-1 "
            />
            <FaLock className="text-zinc-700 w-10" size={16} />
          </div>
        </label>
      </section>
      <footer className="w-full">
        <button
          type="submit"
          style={{ opacity: isSubmitting ? 0.6 : 0.9 }}
          className="w-full bg-indigo-600 p-2 rounded opacity-90 hover:opacity-100"
        >
          Login
        </button>
      </footer>
    </form>
  );
}
