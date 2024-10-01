import { Modal } from "@/components/modal-template";
import { fontOpenSans } from "@/fonts";
import { AnimatePresence, motion } from "framer-motion";
import { Controller } from "react-hook-form";
import { CgCalendarToday } from "react-icons/cg";
import { FaHourglassStart, FaRepeat } from "react-icons/fa6";
import { MdDriveFileRenameOutline } from "react-icons/md";
import { useAddTask } from "./hooks";

const days = ["D", "S", "T", "Q", "Q", "S", "S"];

export default function AddTaskModal() {
  const { form } = useAddTask();
  const { addTask } = useAddTask();

  const daysField = form.watch("days");
  const repeat = form.watch("repeat");

  return (
    <Modal title="Adicionar nova task" className="max-w-[40rem]">
      <form
        onSubmit={form.handleSubmit(addTask)}
        className="flex flex-col bg-white dark:bg-transparent gap-3"
      >
        <section className={`${fontOpenSans} flex flex-col gap-7 p-5`}>
          <label htmlFor="name" className="flex flex-col gap-2">
            <div className="text-zinc-500 dark:text-zinc-100 flex gap-2 items-center">
              <MdDriveFileRenameOutline />
              <span className="text-md">Nome</span>
            </div>
            <input
              type="text"
              id="name"
              required
              autoComplete="off"
              {...form.register("name")}
              className="p-3 bg-zinc-100 dark:bg-zinc-800 font-semibold text-zinc-600 dark:text-zinc-200 ring-0 focus:ring-2 ring-indigo-400 dark:ring-indigo-600 transition-shadow rounded-md outline-none"
              placeholder="Terminar projeto..."
            />
          </label>

          <div className="flex flex-col gap-2">
            <div className="text-zinc-500 dark:text-zinc-100 flex gap-2 items-center">
              <CgCalendarToday />
              <span className="text-md">Dias</span>
            </div>
            <div className="flex gap-2 items-center">
              {days?.map((day: string, index: number) => {
                return (
                  <label
                    key={index}
                    data-selected={!!daysField[index]}
                    htmlFor={`check-day-${index}`}
                    className="w-10 h-10 grid place-items-center bg-zinc-100 data-[selected=true]:bg-indigo-600 cursor-pointer transition-colors
                    data-[selected=true]:text-white data-[selected=true]:opacity-100 dark:data-[selected=true]:bg-indigo-600 border-l dark:bg-zinc-800 dark:border-zinc-700 rounded-full opacity-90 hover:opacity-100"
                  >
                    <input
                      type="checkbox"
                      className="hidden"
                      id={`check-day-${index}`}
                      {...form.register(`days.${index}`)}
                    />
                    <span className="text-sm font-semibold">{day}</span>
                  </label>
                );
              })}
            </div>
          </div>

          <label htmlFor="repeat" className="flex flex-col gap-2">
            <div className="text-zinc-500 dark:text-zinc-100 flex gap-2 items-center">
              <FaRepeat />
              <span className="text-md">Repetir semanalmente</span>
            </div>
            <Controller
              control={form.control}
              name="repeat"
              render={({ field }) => {
                return (
                  <button
                    type="button"
                    data-selected={!!field.value}
                    onClick={() => field.onChange(!!field.value ? false : true)}
                    className="w-[4.2rem] h-[2.2rem] px-1 flex items-center bg-zinc-100 dark:bg-zinc-800 rounded-full
                    data-[selected=true]:justify-end"
                  >
                    <motion.div
                      layout
                      data-selected={!!field.value}
                      transition={{ type: "spring" }}
                      className="w-[2rem] h-[2rem] bg-indigo-600 rounded-full shadow dark:shadow-black border-l border-zinc-400/50
                      data-[selected=false]:bg-zinc-300 dark:data-[selected=false]:bg-zinc-700 transition-colors"
                    />
                  </button>
                );
              }}
            />
          </label>

          <div className="flex gap-2">
            <label htmlFor="startAt" className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <FaHourglassStart />
                <span className="">Começa em</span>
              </div>
              <input
                type="date"
                id="startAt"
                required
                autoComplete="off"
                {...form.register("startAt")}
                className="p-3 bg-zinc-100 dark:bg-zinc-800 ring-0 focus:ring-2 ring-indigo-400 dark:ring-indigo-600 transition-shadow rounded-md outline-none"
                placeholder="Terminar projeto..."
              />
            </label>

            <AnimatePresence>
              {repeat && (
                <motion.label
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  htmlFor="endAt"
                  className="flex flex-col gap-2"
                >
                  <span className="">Termina em</span>
                  <input
                    type="date"
                    id="endAt"
                    required
                    {...form.register("endAt")}
                    autoComplete="off"
                    className="p-3 bg-zinc-100 dark:bg-zinc-800 ring-0 focus:ring-2 ring-indigo-400 dark:ring-indigo-600 transition-shadow rounded-md outline-none"
                    placeholder="Terminar projeto..."
                  />
                </motion.label>
              )}
            </AnimatePresence>
          </div>
        </section>
        <footer className="w-full flex justify-between items-center p-5 border-t-4 dark:border-zinc-800">
          <button className="bg-zinc-100 dark:bg-zinc-800 p-2 rounded opacity-90 hover:opacity-100">
            Cancelar
          </button>
          <button
            type="submit"
            className="bg-indigo-600 opacity-90 hover:opacity-100 p-2 px-3 text-white rounded"
          >
            Concluído
          </button>
        </footer>
      </form>
    </Modal>
  );
}
