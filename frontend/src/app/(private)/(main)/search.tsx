"use client";

import { Modal } from "@/components/modal-base";
import { useSearch } from "./hooks";
import { Loader } from "@/components/loader";
import { fontOpenSans, fontSaira } from "@/fonts";
import Link from "next/link";
import dayjs from "dayjs";

const Loading = () => <Loader className="m-auto" />;

export const SearchComponent = () => {
  const { searchAction, setSearchTerm, searchTerm, loading } = useSearch();
  const { data, isLoading } = searchAction;

  const isLoader = isLoading || loading;

  return (
    <Modal.container>
      <Modal.box className="max-w-[50rem] h-auto rounded-xl overflow-hidden">
        <header className="flex items-center gap-1 p-1 pr-2 border-b border-zinc-200 dark:border-zinc-800">
          <input
            type="text"
            value={searchTerm}
            placeholder="Pesquise aqui..."
            onChange={(e) => setSearchTerm(e.currentTarget.value)}
            className="outline-none p-2 text-lg bg-transparent rounded-lg w-full flex-1"
          />
          <Modal.close />
        </header>

        <section className="flex p-2 min-h-[20rem] flex-col">
          {isLoader && <Loading />}

          {!isLoader && !data?.length && (
            <div className="flex m-auto p-1 px-3 dark:bg-zinc-800 rounded-md border-zinc-200">
              <span
                className={`${fontSaira} text-gray-600 text-lg dark:text-zinc-300`}
              >
                Nenhum card encontrado.
              </span>
            </div>
          )}

          {!isLoader &&
            data?.map((card) => (
              <Link
                href={`/card/${card.id}`}
                className="flex items-center gap-2 p-2 hover:bg-stone-100 dark:hover:bg-zinc-800 rounded-xl"
              >
                <span
                  className={`${fontOpenSans} text-lg font-semibold flex-[3]`}
                >
                  {card.title}
                </span>

                <div className="flex px-2 flex-1">
                  {card.contentLength || 0} Caracteres
                </div>

                <div className="px-2">
                  {dayjs(card.createdAt).format("YYYY-MM-DD")}
                </div>
              </Link>
            ))}
        </section>
      </Modal.box>
    </Modal.container>
  );
};
