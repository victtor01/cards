import { api } from "@/api";
import { queryClient } from "@/providers/query-client";
import { TaskSchema, taskSchema } from "@/schemas/task-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

type CreateTask = {
  name: string;
  days: number[];
  description: string | null;
  hour: string | null | undefined;
  repeat: "weekly" | false;
  startAt: Date | string;
  endAt: Date | string | null;
};

export const useAddTask = () => {
  const date = dayjs();
  const router = useRouter();
  const [dateOfFinish, setDateOfFinish] = useState<boolean>(false);
  const [defineHour, setDefineHour] = useState<boolean>(false);
  const handleDateOfFinish = () => setDateOfFinish((prev) => !prev);
  const handleDefineHour = () => setDefineHour(prev => !prev);

  const status = () =>
    [0, 1, 2, 3, 4, 5, 6]?.map((value) => value === date.day());

  const form = useForm<TaskSchema>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      days: [...status()],
      repeat: false,
      hour: null,
      startAt: dayjs().startOf('week').format('YYYY-MM-DD'),
      endAt: null,
    },
  });

  const addTask = async (data: TaskSchema) => {
    const { name, days, repeat, description, ...temp } = data;
    const { startAt, hour } = temp;

    const endAt = repeat
      ? temp.endAt
        ? new Date(temp.endAt)
        : null
      : dayjs(startAt).endOf("week").format("YYYY-MM-DD");

    const daysInIndex = days
      ?.map((day, index) => (!!day ? index : null))
      ?.filter((vl) => typeof vl === "number");

    const createTaskData = {
      repeat: !!repeat ? "weekly" : false,
      description: description,
      endAt: endAt,
      startAt: new Date(startAt),
      hour: hour,
      days: daysInIndex,
      name: name,
    } satisfies CreateTask;

    try {
      await api.post("/tasks", createTaskData);
      await queryClient.invalidateQueries({
        queryKey: ["tasks"],
      });

      toast.success("Criado com sucesso!");
      router.push("?");
    } catch (error) {
      toast.error("Houve um erro ao adicionar nova task!");
    }
  };

  const startAtField = form.watch("startAt");
  const repeat = form.watch("repeat");

  useEffect(() => {
    const startAt = form.getValues("startAt");
    if (!!dateOfFinish) {
      form.setValue(
        "endAt",
        dayjs(startAt).add(2, "week").format("YYYY-MM-DD")
      );
    }
  }, [startAtField, dateOfFinish]);

  useEffect(() => {
    if(!repeat) {
      setDateOfFinish(false);
    }
  },[repeat])

  useEffect(() => {
    if(defineHour) {
      form.setValue("hour", dayjs().format('HH:mm'))
    }
  },[defineHour])

  return {
    form,
    dateOfFinish,
    states: { handleDefineHour, defineHour },
    handleDateOfFinish,
    addTask,
  };
};