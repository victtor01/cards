import { fontFiraCode, fontInter, fontValela } from "@/fonts";

type PropsLayout = {
  children: React.ReactNode;
};

export default function Layout({ children }: PropsLayout) {
  return (
    <main className="w-full h-auto flex-1 flex flex-col">
      <header className="p-1 border-b dark:border-zinc-800">
        <div className="flex justify-between mx-auto max-w-main items-center dark:text-zinc-300">
          <div className="flex text-zinc-600 dark:text-zinc-300">
            <h1 className={`${fontValela} text-xl`}>Flards</h1>
          </div>
          <div className="flex text-zinc-500 dark:text-zinc-200">
            <button className={`${fontFiraCode} border rounded-md p-2 px-4 dark:border-zinc-700 opacity-90 hover:opacity-100 capitalize`}>
              Singup
            </button>
          </div>
        </div>
      </header>

      <section className="flex flex-1 w-full">
        {children}
      </section>
    </main>
  );
}
