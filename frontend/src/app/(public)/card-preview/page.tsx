"use client";

import { fontSaira } from "@/fonts";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { LuFileSearch } from "react-icons/lu";
import { toast } from "react-toastify";

export default function CardPreviewSearch() {
  const ref = useRef<HTMLInputElement | null>(null);
  const router = useRouter();

  const search = () => {
    if (!ref) return;

    const value = ref.current?.value || "";

    if (value?.length < 6) {
      toast.error("Digite um código válido!");
      return;
    }

    router.push(`/card-preview/${value}`);
  };

  return (
    <section className="flex flex-col gap-2 flex-1">
      <div className="flex flex-col gap-5 m-auto w-full max-w-[30rem]">
        <header className="grid gap-4 place-items-center dark:text-gray-100 text-gray-500">
          <LuFileSearch size={70} />
          <h2 className={`${fontSaira} flex font-semibold text-3xl`}>
            Pesquise por um arquivo
          </h2>
        </header>
        <div className="flex gap-3 items-center">
          <input
            ref={ref}
            type="text"
            placeholder="Pesquise aqui..."
            className={`${fontSaira} font-semibold text-lg text-gray-500 dark:text-white p-2 rounded-lg bg-stone-50 outline-none border flex-1`}
          />

          <button
            type="button"
            onClick={search}
            className="flex p-2 px-4 text-indigo-50 font-semibold rounded-lg bg-indigo-500 shadow-md shadow-indigo-500 border-t border-l border-indigo-600 opacity-90 hover:opacity-100 transition-all hover:shadow-lg hover:shadow-indigo-600/70"
          >
            <span className={fontSaira}>Pesquisar</span>
          </button>
        </div>
      </div>
    </section>
  );
}
