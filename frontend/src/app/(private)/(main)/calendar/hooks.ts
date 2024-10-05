import { api } from "@/api";
import { queryClient } from "@/providers/query-client";
import { zodResolver } from "@hookform/resolvers/zod";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { z } from "zod";

const createTaskSchema = z.object({
  name: z.string(),
  days: z.array(z.boolean()),
  hour: z.string().nullable().optional(),
  repeat: z.boolean(),
  startAt: z.string(),
  endAt: z.string().optional().nullable(),
});

export type CreateTaskSchema = z.infer<typeof createTaskSchema>;

type CreateTask = {
  name: string;
  days: number[];
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

  const form = useForm<CreateTaskSchema>({
    resolver: zodResolver(createTaskSchema),
    defaultValues: {
      days: [...status()],
      repeat: false,
      hour: null,
      startAt: date.format("YYYY-MM-DD"),
      endAt: null,
    },
  });

  const addTask = async (data: CreateTaskSchema) => {
    const { name, days, repeat, ...temp } = data;
    const { startAt } = temp;

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
      endAt: endAt,
      startAt: new Date(startAt),
      days: daysInIndex,
      name: name,
    } satisfies CreateTask;

    console.log(createTaskData);

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
  useEffect(() => {
    const endAt = form.getValues("endAt");
    const startAt = form.getValues("startAt");

    if (endAt && new Date(endAt) < new Date(startAt)) {
      form.setValue(
        "endAt",
        dayjs(startAt).add(2, "week").format("YYYY-MM-DD")
      );
    }
  }, [startAtField]);

  return {
    form,
    dateOfFinish,
    states: { handleDefineHour, defineHour },
    handleDateOfFinish,
    addTask,
  };
};