import { Modal } from "@/components/modal-template";
import { fontFiraCode, fontOpenSans } from "@/fonts";
import { AnimatePresence, motion } from "framer-motion";
import { Controller } from "react-hook-form";
import { CgCalendarToday, CgCheck } from "react-icons/cg";
import { FaRepeat } from "react-icons/fa6";
import { MdDriveFileRenameOutline } from "react-icons/md";

import dayjs from "dayjs";
import { TbClockHour12Filled } from "react-icons/tb";
import { TiMediaPlay } from "react-icons/ti";
import { useAddTask } from "./hooks";
import TextareaAutosize from "react-textarea-autosize";

export const days = ["D", "S", "T", "Q", "Q", "S", "S"];

export default function AddTaskModal() {
  const { form, addTask, handleDateOfFinish, dateOfFinish, states } =
    useAddTask();
  const { handleDefineHour, defineHour } = states;

  const daysField = form.watch("days");
  const repeat = form.watch("repeat");

  return (
    <Modal
      title="Adicionar nova task"
      className="max-w-[40rem] mt-[5rem] mb-[5rem] bg-gray-100"
    >
      <form
        onSubmit={form.handleSubmit(addTask)}
        className="flex flex-col gap-3 overflow-hidden"
      >
        <section className={`${fontOpenSans} flex flex-col gap-7 px-5`}>
          <label htmlFor="name" className="flex flex-col gap-2">
            <div className="text-zinc-500 dark:text-zinc-100 flex gap-2 items-center">
              <MdDriveFileRenameOutline />
              <span className="text-md">Nome.</span>
            </div>
            <input
              type="text"
              id="name"
              required
              autoComplete="off"
              {...form.register("name")}
              className="p-3 bg-white dark:bg-zinc-800 border-b-4 border-indigo-600 dark:shadow-black font-semibold text-zinc-600 dark:text-zinc-200 ring-0 focus:ring-2 ring-indigo-400 dark:ring-indigo-600 transition-shadow rounded-md outline-none"
              placeholder="Terminar projeto..."
            />
          </label>

          <label htmlFor="description" className="flex flex-col gap-1">
            <div className="flex justify-between items-center">
              <b>Descrição</b>
              <span>{255 - (form.watch("description")?.length || 0)}</span>
            </div>
            <TextareaAutosize
              maxLength={255}
              id="description"
              className={` bg-white dark:bg-neutral-800 placeholder:text-opacity-55 rounded-md resize-none text-md text-gray-600 font-semibold dark:text-zinc-300 max-h-[15rem] p-2 shadow outline-none border-b-4 border-indigo-600`}
              placeholder="Essa é uma task de exemplo"
              {...form.register("description")}
            />
          </label>

          <div className="flex flex-col gap-2">
            <div className="text-zinc-500 dark:text-zinc-100 flex gap-2 items-center">
              <CgCalendarToday />
              <span className="text-md">Dias.</span>
            </div>
            <div className="flex gap-2 items-center">
              {days?.map((day: string, index: number) => {
                return (
                  <label
                    key={index}
                    data-selected={!!daysField[index]}
                    htmlFor={`check-day-${index}`}
                    className="w-10 h-10 shadow grid place-items-center bg-white data-[selected=true]:bg-indigo-600 cursor-pointer transition-colors
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

          <div className="flex gap-1 p-2 flex-col text-zinc-500 dark:text-zinc-300 bg-white dark:bg-zinc-800/30 rounded-md shadow dark:shadow-black">
            <label htmlFor="repeat" className="flex items-center gap-2">
              <div className="flex-1 flex gap-2 items-center px-2">
                <FaRepeat />
                <span className="text-md">Repetir semanalmente.</span>
              </div>

              <Controller
                control={form.control}
                name="repeat"
                render={({ field }) => {
                  return (
                    <button
                      type="button"
                      data-selected={!!field.value}
                      onClick={() =>
                        field.onChange(!!field.value ? false : true)
                      }
                      className="w-[4.2rem] h-[2.2rem] px-[0.1rem] flex items-center bg-zinc-100 dark:bg-zinc-800 rounded-lg
                      data-[selected=true]:justify-end overflow-hidden"
                    >
                      <motion.div
                        layout
                        data-selected={!!field.value}
                        transition={{ type: "spring", duration: 0.1 }}
                        className="w-[2rem] h-[2rem] bg-indigo-600 rounded-md shadow-lg shadow-zinc-600 dark:shadow-black border-l border-zinc-400/50
                        data-[selected=false]:bg-zinc-400 dark:data-[selected=false]:bg-zinc-700 transition-colors"
                      />
                    </button>
                  );
                }}
              />
            </label>

            {repeat && (
              <div className="flex items-center gap-2">
                <div className=" flex-1 flex gap-2 items-center px-2">
                  <CgCheck size={20} />
                  <span className="text-md">Definir data de termino</span>
                </div>

                <button
                  type="button"
                  data-selected={dateOfFinish}
                  onClick={handleDateOfFinish}
                  className="w-[4.2rem] h-[2.2rem] px-[0.1rem] flex items-center bg-zinc-200 dark:bg-zinc-800 rounded-lg
                  data-[selected=true]:justify-end overflow-hidden"
                >
                  <motion.div
                    layout
                    data-selected={dateOfFinish}
                    transition={{ type: "spring", duration: 0.1 }}
                    className="w-[2rem] h-[2rem] bg-indigo-600 rounded-md shadow-lg shadow-zinc-600 dark:shadow-black border-l border-zinc-400/50
                  data-[selected=false]:bg-zinc-400 dark:data-[selected=false]:bg-zinc-700 transition-colors"
                  />
                </button>
              </div>
            )}

            <div className="flex items-center gap-2">
              <div className="flex-1 flex gap-2 items-center px-2">
                <TbClockHour12Filled />
                <span className="text-md">Definir horário</span>
              </div>

              <button
                type="button"
                data-selected={defineHour}
                onClick={handleDefineHour}
                className="w-[4.2rem] h-[2.2rem] px-[0.1rem] flex items-center bg-zinc-200 dark:bg-zinc-800 rounded-lg
                    data-[selected=true]:justify-end overflow-hidden"
              >
                <motion.div
                  layout
                  data-selected={defineHour}
                  transition={{ type: "spring", duration: 0.1 }}
                  className="w-[2rem] h-[2rem] bg-indigo-600 rounded-md shadow-lg shadow-zinc-600 dark:shadow-black border-l border-zinc-400/50 data-[selected=false]:bg-zinc-400 dark:data-[selected=false]:bg-zinc-700 transition-colors"
                />
              </button>
            </div>
          </div>

          <div className="flex gap-2 items-center justify-between">
            {repeat && (
              <label htmlFor="startAt" className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <span className={fontOpenSans}>Começa em</span>
                  <span
                    className={`${fontFiraCode} p-1 text-sm bg-white shadow rounded-md px-2 dark:bg-zinc-800 `}
                  >
                    {dayjs(form.watch("startAt")).format("ddd, DD [de] MMM") ||
                      ""}
                  </span>
                </div>
                <input
                  type="date"
                  id="startAt"
                  required
                  autoComplete="off"
                  {...form.register("startAt")}
                  className="p-3 bg-white dark:bg-zinc-800 shadow ring-0 focus:ring-2 ring-indigo-400 dark:ring-indigo-600 transition-shadow rounded-md outline-none"
                  placeholder="Terminar projeto..."
                />
              </label>
            )}

            {dateOfFinish && (
              <span className="opacity-50">
                <TiMediaPlay size={20} />
              </span>
            )}

            <AnimatePresence>
              {dateOfFinish && (
                <motion.label
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  htmlFor="endAt"
                  className="flex flex-col gap-2"
                >
                  <div className="flex items-center gap-2">
                    <span className={fontOpenSans}>Termina em</span>
                    <span
                      className={`${fontFiraCode} text-sm p-1 bg-white shadow rounded-md px-2 dark:bg-zinc-800 `}
                    >
                      {dayjs(form.watch("endAt")).format("ddd, DD [de] MMM") ||
                        ""}
                    </span>
                  </div>
                  <input
                    type="date"
                    id="endAt"
                    defaultValue={dayjs().format("YYYY-MM-DD")}
                    required
                    {...form.register("endAt")}
                    autoComplete="off"
                    className="p-3 bg-white shadow dark:bg-zinc-800 ring-0 focus:ring-2 ring-indigo-400 dark:ring-indigo-600 transition-shadow rounded-md outline-none"
                    placeholder="Terminar projeto..."
                  />
                </motion.label>
              )}
            </AnimatePresence>
          </div>

          {defineHour && (
            <motion.label
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              htmlFor="hour"
              className="flex flex-col gap-2"
            >
              <div className="flex items-center gap-2">
                <TbClockHour12Filled />
                <span className="">Horário da task</span>
              </div>
              <div>
                <input
                  type="time"
                  id="hour"
                  required
                  autoComplete="off"
                  {...form.register("hour")}
                  className="p-3 bg-white dark:bg-zinc-800 ring-0 focus:ring-2 ring-indigo-400 dark:ring-indigo-600 transition-shadow rounded-md outline-none"
                  placeholder="Terminar projeto..."
                />
              </div>
            </motion.label>
          )}
        </section>
        <footer className="w-full flex justify-between items-center p-5 border-t-4 dark:border-zinc-800 rounded-lg">
          <button className="bg-white shadow dark:shadow-black text-zinc-500 dark:bg-zinc-800 p-2 rounded opacity-90 hover:opacity-100">
            Cancelar
          </button>
          <button
            type="submit"
            className="bg-indigo-600 opacity-90 hover:opacity-100 p-2 px-3 text-white rounded"
          >
            Go
          </button>
        </footer>
      </form>
    </Modal>
  );
}
