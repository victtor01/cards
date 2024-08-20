import { fontFiraCode } from "@/fonts";
import { ReactNode } from "react";
import { PiCardsFill } from "react-icons/pi";

type PropsLayout = {
  children: React.ReactNode;
};

export default function Layout({ children }: PropsLayout) {
  return (
    <main className="w-full h-auto flex-1 flex flex-col">
      <header className="p-2 bg-zinc-50 border-b dark:border-zinc-800 dark:bg-zinc-900 dark:bg-opacity-70 z-30">
        <div className="flex justify-between mx-auto max-w-main items-center dark:text-zinc-300">
          <div className="flex text-zinc-100 bg-indigo-600 p-1 px-2 rounded items-center gap-2">
            <PiCardsFill className="text-white"/>
            <h1 className={`${fontFiraCode} text-md`}>Flards</h1>
          </div>
          <div className="flex text-zinc-500 dark:text-zinc-200">
            <button
              className={`${fontFiraCode} border bg-white text-zinc-800 rounded-md hover:shadow-lg dark:hover:bg-indigo-600 transition-all p-1 px-3 dark:border-zinc-700 opacity-90 hover:opacity-100 capitalize`}
            >
              Create account
            </button>
          </div>
        </div>
      </header>

      <section className="flex flex-1 w-full relative">{children}</section>
      <div className="fixed top-0 left-0 w-full h-screen overflow-hidden">
        <div className="grid-image"></div>
      </div>
    </main>
  );
}
