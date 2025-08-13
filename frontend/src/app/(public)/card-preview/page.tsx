"use client";

import { fontSaira } from "@/fonts";
import { useRouter } from "next/navigation";
import { useRef } from "react";
import { LuFileSearch } from "react-icons/lu";
import { toast } from "react-toastify";

export default function CardPreviewSearch() {
  const ref = useRef<HTMLInputElement | null>(null);
  const router = useRouter();

  const search = () => {
    if (!ref.current) return;
    const value = ref.current.value || "";

    if (value?.length < 6) {
      toast.error("Digite um código de busca válido!");
      return;
    }
    router.push(`/card-preview/${value}`);
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      search();
    }
  };

  return (
    // Seção principal que ocupa a tela toda e contém o fundo
    <section className="relative flex w-full min-h-screen py-10 px-5 bg-white dark:bg-zinc-900 overflow-hidden overflow-y-auto">
      <div className="fixed top-0 -left-1/4 w-96 h-96 bg-indigo-500 rounded-full opacity-40 filter blur-3xl animate-blob-spin"></div>
      <div className="fixed bottom-0 -right-1/4 w-96 h-96 bg-violet-500 rounded-full opacity-30 filter blur-3xl animate-blob-spin animation-delay-4000"></div>

      <div className="relative z-10 flex m-auto flex-col gap-8 p-8 w-full max-w-lg bg-white/30 dark:bg-zinc-900/40 rounded-2xl shadow-2xl border border-white/20 backdrop-blur-xl animate-fade-in-up">
        <header className="grid gap-4 place-items-center text-center text-zinc-800 dark:text-zinc-100">
          <div className="relative">
            <div className="absolute -inset-2 bg-indigo-500/50 rounded-full blur-xl animate-pulse"></div>
            <LuFileSearch size={70} className="relative text-indigo-500 dark:text-indigo-200" />
          </div>
          <h2 className={`${fontSaira} font-bold text-4xl`}>
            Consultar Arquivo
          </h2>
          <p className="text-zinc-600 dark:text-zinc-400 -mt-2">
            Insira o código único para visualizar o documento.
          </p>
        </header>

        <div className="flex flex-col sm:flex-row gap-3 items-center">
          <input
            ref={ref}
            type="text"
            onKeyPress={handleKeyPress}
            placeholder="Digite o código aqui..."
            className={`${fontSaira} w-full flex-1 p-3 text-lg font-semibold bg-white/50 dark:bg-zinc-800/60 text-zinc-700 dark:text-white rounded-lg border-2 border-transparent outline-none transition-all duration-300 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:ring-4 focus:ring-violet-500/70 focus:border-violet-500`}
          />

          <button
            type="button"
            onClick={search}
            className="w-full sm:w-auto flex justify-center p-3 px-6 text-white font-semibold rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 shadow-lg shadow-indigo-500/30 transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/50 hover:scale-105"
          >
            <span className={fontSaira}>Pesquisar</span>
          </button>
        </div>
      </div>
    </section>
  );
}
