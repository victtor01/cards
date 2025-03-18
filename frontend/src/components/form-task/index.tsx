"use client";

import { fontFiraCode, fontOpenSans, fontSaira } from "@/fonts";
import { ITask } from "@/interfaces/ITask";
import { TaskSchema } from "@/schemas/task-schema";
import dayjs from "dayjs";
import { motion } from "framer-motion";
import { HtmlHTMLAttributes } from "react";
import { Controller, FormProvider, useFormContext } from "react-hook-form";
import { BsCalendar3EventFill } from "react-icons/bs";
import { CgCheck } from "react-icons/cg";
import { FaBookmark } from "react-icons/fa";
import { FaRepeat } from "react-icons/fa6";
import { IoCalendarNumberSharp, IoClose } from "react-icons/io5";
import { MdBlockFlipped } from "react-icons/md";
import { PiTextAlignLeftFill } from "react-icons/pi";
import { SlOptionsVertical } from "react-icons/sl";
import { TbClockHour12Filled } from "react-icons/tb";
import TextareaAutosize from "react-textarea-autosize";
import { twMerge } from "tailwind-merge";
import InputTime from "../input-time";
import { useFormTask, useFormTaskAction, verifyInputTypeTime } from "./hooks";
import { BiCheck } from "react-icons/bi";

interface FormTaskBaseProps extends HtmlHTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode | null;
}

type FormTaskHeaderProps = {} & FormTaskBaseProps;

type FormTaskFooterProps = {} & FormTaskBaseProps &
  HtmlHTMLAttributes<HTMLDivElement>;

type FormTaskContainerProps = {
  task?: ITask;
  handleSubmit: (data: any) => any;
} & FormTaskBaseProps;

const days = ["D", "S", "T", "Q", "Q", "S", "S"];

const marks = [
  { name: "Urgencia", color: "rgb(225 29 72 / 1)" },
  { name: "Alerta", color: "rgb(234 179 8)" },
  { name: "Sem pressa", color: "rgb(79 70 229)" },
];

function FormTaskContainer({
  handleSubmit,
  children,
  task,
}: FormTaskContainerProps) {
  const { form } = useFormTask(task);

  return (
    <FormProvider {...form}>
      <form
        className="w-full flex flex-col gap-2"
        onSubmit={form.handleSubmit(handleSubmit)}
      >
        {children}
      </form>
    </FormProvider>
  );
}

function FormTaskHeader({ children }: FormTaskHeaderProps) {
  const { register } = useFormContext<TaskSchema>();

  return (
    <header className="w-full flex p-5 pb-2 justify-between items-center gap-5">
      <div
        className={`flex items-center flex-1 gap-5 text-zinc-500 dark:text-zinc-400 ${fontFiraCode}`}
      >
        <input
          {...register("name")}
          className="text-lg font-semibold bg-transparent rounded flex-1 outline-none"
          type="text"
          placeholder="Digite um nome para a task..."
        />
      </div>
      {children}
    </header>
  );
}

function FormTaskSection({ children }: FormTaskBaseProps) {
  const {
    form,
    watchs: { daysWatch, repeatWatch },
    handles: { handleDateOfFinish, handleDefineHour },
    states: { dateOfFinishState, defineHourState },
  } = useFormTaskAction();

  const { register, watch, control } = form;

  const startAtField = watch("startAt");
  const endAtField = watch("endAt");
  const colorSelected = watch("color");

  const diff =
    !!startAtField && !!endAtField
      ? dayjs(endAtField).diff(startAtField, "week")
      : "";

  return (
    <section className="flex flex-col gap-2 pb-5">
      <label htmlFor="description" className="flex flex-col gap-1 px-5">
        <div className="flex justify-between items-center">
          <div
            className={`${fontOpenSans} mt-2 text-zinc-500 dark:text-zinc-100 flex items-center`}
          >
            <div className="w-6">
              <PiTextAlignLeftFill size={20} />
            </div>
            <span>Descrição</span>
          </div>
          <span className={`${fontSaira} opacity-50`}>
            {255 - (watch("description")?.length || 0)}
          </span>
        </div>
        <div className="flex w-full flex-1">
          <div className="w-6" />{" "}
          <TextareaAutosize
            maxLength={255}
            id="description"
            className={`bg-white border dark:bg-neutral-800/60 dark:border-zinc-700/60 w-full placeholder:text-opacity-55 resize-none text-md text-gray-600 font-semibold dark:text-zinc-300 max-h-[15rem] p-3 min-h-[6rem] outline-none rounded-lg`}
            placeholder="Descrição..."
            {...register("description")}
          />
        </div>
      </label>

      <div
        className={`${fontOpenSans} mt-2 px-5 text-zinc-500 dark:text-zinc-200 flex items-center`}
      >
        <div className="w-6">
          <SlOptionsVertical />
        </div>
        <span>Opções</span>
      </div>

      <div className="flex mr-5 border ml-[2.5rem] divide-y divide-zinc-200 divide-zinc-600/80 flex-col text-zinc-500 dark:text-zinc-400 bg-white rounded-md dark:bg-neutral-800/60 dark:border-zinc-700/60">
        <label htmlFor="defineHourState" className="flex items-center gap-2 p-2">
          <div className="flex-1 flex gap-2 items-center px-2">
            <span className="text-md">Definir horário</span>
          </div>

          <button
            type="button"
            id="defineHourState"
            data-selected={defineHourState}
            onClick={handleDefineHour}
            className="w-[4.2rem] h-[2.2rem] px-[0.1rem] ring-2 ring-gray-200 dark:ring-zinc-800 flex items-center bg-zinc-200 dark:bg-zinc-800 rounded-full data-[selected=true]:justify-end overflow-hidden"
          >
            <motion.div
              layout
              data-selected={defineHourState}
              transition={{ type: "spring", duration: 0.1 }}
              className="w-[2rem] h-[2rem] bg-indigo-600 rounded-full dark:shadow-black border-l border-zinc-200/50 
              data-[selected=false]:bg-zinc-300 dark:data-[selected=false]:bg-zinc-700 transition-colors grid place-items-center
              data-[selected=true]:text-white"
            >
              {defineHourState && <BiCheck />}
              {!defineHourState && <IoClose />}
            </motion.div>
          </button>
        </label>

        <label htmlFor="repeat" className="flex items-center gap-2 p-2">
          <div className="flex-1 flex gap-2 items-center px-2">
            <span className="text-md">Repetir semanalmente.</span>
          </div>

          <Controller
            control={control}
            name="repeat"
            render={({ field }) => {
              return (
                <button
                  id="repeat"
                  type="button"
                  data-selected={!!field.value}
                  onClick={() => field.onChange(!!field.value ? false : true)}
                  className="w-[4.2rem] h-[2.2rem] px-[0.1rem] ring-2 ring-gray-200 dark:ring-zinc-800 flex items-center bg-zinc-200 dark:bg-zinc-800 rounded-full data-[selected=true]:justify-end overflow-hidden"
                >
                  <motion.div
                    layout
                    data-selected={!!field.value}
                    transition={{ type: "spring", duration: 0.1 }}
                    className="w-[2rem] h-[2rem] bg-indigo-600 rounded-full dark:shadow-black border-l border-zinc-200/50 
                    data-[selected=false]:bg-zinc-300 dark:data-[selected=false]:bg-zinc-700 transition-colors grid place-items-center
                    data-[selected=true]:text-white"
                  >
                    {!!field?.value && <BiCheck />}
                    {!field?.value && <IoClose />}
                  </motion.div>
                </button>
              );
            }}
          />
        </label>

        {repeatWatch && (
          <div className="flex items-center p-2">
            <div className=" flex-1 flex gap-2 items-center px-2">
              <span className="text-md">Data de termino</span>
            </div>

            <button
              type="button"
              data-selected={dateOfFinishState}
              onClick={handleDateOfFinish}
              className="w-[4.2rem] h-[2.2rem] px-[0.1rem] ring-2 ring-gray-200  dark:ring-zinc-800 flex items-center bg-zinc-200 dark:bg-zinc-800 rounded-full data-[selected=true]:justify-end overflow-hidden"
            >
              <motion.div
                layout
                data-selected={dateOfFinishState}
                transition={{ type: "spring", duration: 0.1 }}
                className="w-[2rem] h-[2rem] bg-indigo-600 rounded-full dark:shadow-black border-l border-zinc-200/50 
                data-[selected=false]:bg-zinc-300 dark:data-[selected=false]:bg-zinc-700 transition-colors grid place-items-center
                data-[selected=true]:text-white"
              >
                {!!dateOfFinishState && <BiCheck />}
                {!dateOfFinishState && <IoClose />}
              </motion.div>
            </button>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-2 px-5">
        <div
          className={`${fontOpenSans} mt-2 text-zinc-500 dark:text-zinc-100 flex items-center`}
        >
          <div className="w-6">
            <BsCalendar3EventFill size={15} />
          </div>
          <span>Dias</span>
        </div>
        <div className="flex items-center">
          <div className="w-6" />
          {days?.map((day: string, index: number) => {
            return (
              <label
                key={index}
                data-selected={!!daysWatch[index]}
                htmlFor={`check-day-${index}`}
                className="w-10 h-10 data-[selected=false]:shadow data-[selected=true]:scale-[0.9] transition-all grid mr-2 place-items-center bg-white data-[selected=true]:bg-indigo-600 cursor-pointer
                data-[selected=true]:text-white data-[selected=true]:opacity-100 dark:data-[selected=true]:bg-indigo-600 border-l dark:bg-zinc-800 dark:border-zinc-700 rounded-md opacity-90 hover:opacity-100"
              >
                <input
                  type="checkbox"
                  className="hidden"
                  id={`check-day-${index}`}
                  {...register(`days.${index}`)}
                />
                <span className="text-sm font-semibold">{day}</span>
              </label>
            );
          })}
        </div>
      </div>

      <div className="flex flex-col gap-2 px-5">
        <div
          className={`${fontOpenSans} mt-2 text-zinc-500 dark:text-zinc-100 flex items-center`}
        >
          <div className="w-6">
            <FaBookmark size={16} />
          </div>
          <span>Marcador</span>
        </div>
        <div className="flex items-center">
          <div className="w-6" />

          <button
            type="button"
            data-selectedNull={!!colorSelected}
            onClick={() => form.setValue("color", null)}
            className="w-8 h-8 opacity-60 data-[selectedNull=false]:opacity-100 bg-gray-300 dark:bg-zinc-800 mr-2 rounded grid place-items-center text-zinc-600 dark:text-gray-600"
          >
            <MdBlockFlipped />
          </button>

          {marks?.map(({ name, color }, index: number) => {
            return (
              <Controller
                name="color"
                key={index}
                render={({ field }) => {
                  const selected = field.value === color;

                  return (
                    <button
                      type="button"
                      data-selected={selected}
                      onClick={() => field.onChange(color)}
                      style={{ background: color }}
                      className="relative px-2 mr-2 rounded group/button z-30 w-8 h-8 opacity-50 data-[selected=true]:opacity-100  data-[selected=true]:scale-[0.90]"
                    >
                      <span className="top-[100%] bg-white dark:bg-neutral-800 text-sm z-50 rounded-md shadow mt-1 hidden text-nowrap whitespace-nowrap group-hover/button:flex left-0 p-2 absolute">
                        {name}
                      </span>
                    </button>
                  );
                }}
              />
            );
          })}
        </div>
      </div>

      <div className="flex flex-col flex-1 mt-4 *:whitespace-nowrap px-5">
        <div className="flex gap-2 items-center flex-wrap justify-between flex-1">
          <label
            htmlFor="startAt"
            data-repeat={!!repeatWatch}
            className="flex flex-col gap-2 flex-1 data-[repeat=false]:hidden"
          >
            <div
              className={`${fontOpenSans} mt-2 text-zinc-500 dark:text-zinc-100 flex items-center`}
            >
              <div className="w-6">
                <IoCalendarNumberSharp size={18} />
              </div>
              <span className="flex-1">Começa em</span>
            </div>
            <div className="flex">
              <div className="w-6" />
              <input
                disabled={!repeatWatch}
                type="date"
                id="startAt"
                required
                autoComplete="off"
                {...register("startAt")}
                className="p-2 bg-white dark:bg-zinc-800 border dark:border-zinc-700 flex-1 ring-0 focus:ring-2 ring-indigo-400 dark:ring-indigo-600 transition-shadow rounded-md outline-none"
              />
            </div>
          </label>

          <label
            htmlFor="endAt"
            data-finish={dateOfFinishState}
            className="flex flex-col gap-2 flex-1 data-[finish=false]:hidden"
          >
            <div
              className={`${fontOpenSans} mt-2 text-zinc-500 dark:text-zinc-100 flex items-center gap-2`}
            >
              <span className="flex-1">Termina em</span>
            </div>
            <input
              type="date"
              id="endAt"
              disabled={!dateOfFinishState}
              defaultValue={dayjs().format("YYYY-MM-DD")}
              required
              {...register("endAt")}
              autoComplete="off"
              className="p-2 bg-white border dark:border-zinc-700 dark:bg-zinc-800 flex-1 lg:ml-0 ml-5 ring-0 focus:ring-2 ring-indigo-400 dark:ring-indigo-600 transition-shadow rounded-md outline-none"
              placeholder="Terminar projeto..."
            />
          </label>
        </div>
      </div>

      {diff && (
        <div className="flex flex-1 px-5 justify-end gap-2">
          <span className="px-2 p-1 bg-zinc-200 text-zinc-500 dark:text-zinc-500 dark:bg-zinc-800 rounded text-sm">
            {diff} Semanas
          </span>
        </div>
      )}

      <motion.label
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        data-hour={defineHourState}
        htmlFor="hour"
        className="flex flex-col gap-2 px-5 mt-2 data-[hour=false]:hidden"
      >
        <div
          className={`${fontOpenSans} mt-2 text-zinc-500 dark:text-zinc-100 flex items-center`}
        >
          <div className="w-6">
            <TbClockHour12Filled />
          </div>
          <span className="">Horário da task</span>
        </div>
        <div className="flex">
          <div className="w-6" />
          <div className="flex flex-[5] flex-wrap gap-2">
            <Controller
              control={control}
              name="hour"
              render={({ field }) => {
                const { onChange, ...props } = field;
                return (
                  <InputTime
                    {...props}
                    onChange={(value: string) => {
                      const input = verifyInputTypeTime(value);
                      onChange(input);
                    }}
                  />
                );
              }}
            />
          </div>
        </div>
      </motion.label>

      {children}
    </section>
  );
}

function FormTaskFooter({ children, className }: FormTaskFooterProps) {
  const style = twMerge(
    "w-full flex justify-between items-center p-5 border-t-4 dark:border-zinc-800",
    className
  );

  return <footer className={style}>{children}</footer>;
}

const FormTask = {
  Container: FormTaskContainer,
  Header: FormTaskHeader,
  Section: FormTaskSection,
  Footer: FormTaskFooter,
};

export { FormTask };
