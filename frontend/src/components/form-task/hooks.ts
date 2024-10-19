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

  if (
    isNotValidHour ||
    !isValidLength ||
    Number(input[2]) >= 6 ||
    input[1] > "4"
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

  const form = useForm<TaskSchema>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      name: task?.name,
      days: [...status()],
      repeat: !!task?.repeat,
      hour: task?.hour?.toString() || null,
      startAt: task?.startAt
        ? dayjs(task.startAt).format("YYYY-MM-DD")
        : initalStartAt || date.startOf("week").format("YYYY-MM-DD"),
      endAt: task?.endAt ? dayjs(task?.endAt).format("YYYY-MM-DD") : null,
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
});

const getInitalValuesForm = (form: UseFormReturn<TaskSchema>) => ({
  endAtField: form.getValues("endAt"),
  initialHourState: form.getValues("hour"),
  repeatsField: form.getValues("repeat"),
});

const useFormTaskAction = () => {
  const form = useFormContext<TaskSchema>();
  const searchParams = useSearchParams();
  const initalStartAtParam =
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

  const TwoWeeksLater = dayjs(startAtWatch).add(2, "week").format("YYYY-MM-DD");

  useEffect(() => {
    const endAtValue = dateOfFinishState ? TwoWeeksLater : null;
    form.setValue("endAt", endAtValue);
  }, [dateOfFinishState]);

  useEffect(() => {
    const newHour = defineHourState ? dayjs().format("HH:mm") : null;
    form.setValue("hour", newHour);
  }, [defineHourState]);

  useEffect(() => {
    form.setValue("endAt", TwoWeeksLater);
    if (!repeatWatch) setDateOfFinishState(false);
    if (!repeatWatch) form.setValue("startAt", initalStartAtParam);
  }, [repeatWatch]);

  return {
    form,
    handles: { handleDateOfFinish, handleDefineHour },
    states: { dateOfFinishState, defineHourState },
    watchs: { daysWatch, startAtWatch, repeatWatch },
  };
};

export { useFormTask, useFormTaskAction, verifyInputTypeTime };

