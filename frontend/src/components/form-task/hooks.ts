import { ITask } from "@/interfaces/ITask";
import { taskSchema, TaskSchema } from "@/schemas/task-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useForm, useFormContext } from "react-hook-form";

export const verifyInputTypeTime = (value: string) => {
  let input = value.replace(/\D/g, "");

  for (let i = 0; i < input.length - 1; i++) {
    if (parseInt(input[i]) > 5) {
      return "";
    }
  }

  if (Number(input[0]) > 2) {
    return "";
  }

  if (value.length <= 5) {
    input = input.replace(/(\d)(\d{2})$/, "$1:$2");
    return input;
  }
};

export const useFormTask = (task?: ITask) => {
  const date = dayjs();

  const status = () =>
    [0, 1, 2, 3, 4, 5, 6]?.map((value) =>
      task?.days.includes(value.toString())
    );

  const form = useForm<TaskSchema>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      name: task?.name,
      days: [...status()],
      repeat: task?.repeat || false,
      hour: task?.hour?.toString() || null,
      startAt: date.startOf("week").format("YYYY-MM-DD"),
      endAt: task?.endAt ? dayjs(task?.endAt).format("YYYY-MM-DD") : null,
    },
  });

  return {
    form,
  };
};

export const useFormTaskAction = () => {
  const form = useFormContext<TaskSchema>();
  const initialHourState = !!form.getValues("hour");
  const initialFinishDayState =
    !!form.getValues("repeat") && !!form.getValues("endAt");

  const handleDateOfFinish = () => setDateOfFinishState((prev) => !prev);
  const handleDefineHour = () => setDefineHourState((prev) => !prev);
  const [dateOfFinishState, setDateOfFinishState] = useState<boolean>(
    initialFinishDayState
  );
  const [defineHourState, setDefineHourState] =
    useState<boolean>(initialHourState);

  const startAtField = form.watch("startAt");
  const repeatField = form.watch("repeat");
  const daysField = form.watch("days");

  const TwoWeeksLater = dayjs(startAtField).add(2, "week").format("YYYY-MM-DD");

  useEffect(() => {
    if (!dateOfFinishState) form.setValue("endAt", TwoWeeksLater);
  }, [dateOfFinishState]);

  useEffect(() => {
    const newValue = defineHourState ? dayjs().format("HH:mm") : null;
    form.setValue("hour", newValue);
  }, [defineHourState]);

  useEffect(() => {
    const startWeek = dayjs().startOf("week").format("YYYY-MM-DD");
    form.setValue("endAt", TwoWeeksLater);
    if (!repeatField) setDateOfFinishState(false);
    if (!repeatField) form.setValue("startAt", startWeek);
  }, [repeatField]);

  return {
    form,
    handles: { handleDateOfFinish, handleDefineHour },
    watchs: { daysField, startAtField, repeatField },
    states: { dateOfFinishState, defineHourState },
  };
};
