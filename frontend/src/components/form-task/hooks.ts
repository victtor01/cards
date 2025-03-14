import { ITask } from "@/interfaces/ITask";
import { taskSchema, TaskSchema } from "@/schemas/task-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import dayjs from "dayjs";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm, useFormContext, UseFormReturn } from "react-hook-form";

const isValidTimeInput = (input: string): boolean => {
  const isNotValidHour = Number(input[0]) > 2;
  const isValidLength = input?.length <= 4;
  const secoundHourIsNotvalid = Number(input[1]) > 3 && Number(input[0]) >= 2;

  if (
    isNotValidHour ||
    !isValidLength ||
    secoundHourIsNotvalid ||
    Number(input[2]) >= 6
  ) {
    return false;
  }

  return true;
};

const verifyInputTypeTime = (value: string) => {
  let input = value.replace(/\D/g, "");

  const isValid = isValidTimeInput(input);
  if (!isValid) return;

  if (input.length <= 4) {
    input = input.replace(/(\d)(\d{2})$/, "$1:$2");
    return input;
  }

  return "";
};

const useFormTask = (task?: Partial<ITask>) => {
  const date = dayjs();
  const searchParams = useSearchParams();
  const initalStartAt = searchParams.get("startAt");

  const status = () =>
    [0, 1, 2, 3, 4, 5, 6]?.map((value) =>
      task?.days?.includes(value.toString())
    );

  const startAtInitialValueForm = task?.startAt
    ? dayjs(task.startAt).format("YYYY-MM-DD")
    : initalStartAt || date.startOf("week").format("YYYY-MM-DD");

  const endAtInitialValueForm = !!task?.endAt
    ? dayjs(task.endAt).format("YYYY-MM-DD")
    : null;

  const form = useForm<TaskSchema>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      name: task?.name,
      days: [...status()],
      color: task?.color || null,
      repeat: task?.repeat || null,
      hour: task?.hour?.toString() || null,
      startAt: startAtInitialValueForm,
      endAt: endAtInitialValueForm,
    },
  });

  return {
    form,
  };
};

const getWatchsForm = (form: UseFormReturn<TaskSchema>) => ({
  startAtWatch: form.watch("startAt"),
  repeatWatch: form.watch("repeat"),
  daysWatch: form.watch("days"),
  endAtWatch: form.watch("endAt"),
});

const getInitalValuesForm = (form: UseFormReturn<TaskSchema>) => ({
  endAtField: form.getValues("endAt"),
  initialHourState: form.getValues("hour"),
  repeatsField: form.getValues("repeat"),
});

const useFormTaskAction = () => {
  const form = useFormContext<TaskSchema>();
  const searchParams = useSearchParams();
  const initialStartParam =
    searchParams.get("startAt") || dayjs().startOf("week").format("YYYY-MM-DD");

  const { startAtWatch, repeatWatch, daysWatch } = getWatchsForm(form);
  const { endAtField, initialHourState, repeatsField } =
    getInitalValuesForm(form);

  const initialFinishDayState = !!repeatsField && !!endAtField;
  const [dateOfFinishState, setDateOfFinishState] = useState<boolean>(
    initialFinishDayState
  );
  const [defineHourState, setDefineHourState] = useState<boolean>(
    !!initialHourState
  );

  const handleDateOfFinish = () => setDateOfFinishState((prev) => !prev);
  const handleDefineHour = () => setDefineHourState((prev) => !prev);

  const TwoWeeksLater = dayjs(startAtWatch)
    .add(2, "week")
    .subtract(1, "day")
    .format("YYYY-MM-DD");

  useEffect(() => {
    const endAtValue = dateOfFinishState ? TwoWeeksLater : null;
    if (!form.getValues("endAt")) form.setValue("endAt", endAtValue);
  }, [dateOfFinishState, TwoWeeksLater]);

  useEffect(() => {
    if (defineHourState) {
      const newHour = defineHourState ? dayjs().format("HH:mm") : null;
      form.setValue("hour", newHour);
    } else {
      form.setValue("hour", null);
    }
  }, [defineHourState]);

  useEffect(() => {
    if (!repeatWatch) {
      form.setValue("startAt", initialStartParam);
      form.setValue("endAt", null);
      setDateOfFinishState(false);
    }
  }, [repeatWatch, initialStartParam]);

  return {
    form,
    handles: { handleDateOfFinish, handleDefineHour },
    states: { dateOfFinishState, defineHourState },
    watchs: { daysWatch, startAtWatch, repeatWatch },
  };
};

export { useFormTask, useFormTaskAction, verifyInputTypeTime };

