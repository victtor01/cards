import { fontFiraCode, fontOpenSans } from "@/fonts";
import { Modal } from "../modal-template";

export function Trash() {
  return (
    <Modal title="Lixeira">
      <div className="flex px-5 pb-5 flex-col gap-2">
        <InputSearch />

        <section className="flex flex-col gap-2">
          <div className="text-zinc-500">Nenhum item na lixeira</div>
        </section>
      </div>
    </Modal>
  );
}

const InputSearch = () => (
  <label
    htmlFor="search"
    className="border dark:border-zinc-800 rounded-md dark:bg-zinc-800 w-full flex items-center focus-within:ring-2 ring-indigo-400 dark:ring-indigo-600 ring-offset-1 transition-all ring-offset-white dark:ring-offset-zinc-900 bg-white dark:bg-transparent"
  >
    <input
      type="text"
      id="search"
      placeholder="study..."
      className="flex bg-transparent px-3 font-semibold outline-none text-zinc-500 dark:text-zinc-300 w-full p-2 dark:placeholder:text-zinc-300 placeholder:text-zinc-400 placeholder:text-sm"
    />
    <button className="flex px-4 text-white bg-indigo-600 rounded mr-1 text-xs p-1 opacity-90 hover:opacity-100">
      <span className={fontFiraCode}>Go</span>
    </button>
  </label>
);
