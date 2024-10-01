import { api } from "@/api";
import { zodResolver } from "@hookform/resolvers/zod";
import dayjs from "dayjs";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { z } from "zod";

const createTaskSchema = z.object({
  name: z.string(),
  days: z.array(z.boolean()),
  repeat: z.boolean(),
  startAt: z.string(),
  endAt: z.string().optional(),
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
  const status = () =>
    [0, 1, 2, 3, 4, 5, 6]?.map((value) => value === date.day());

  const form = useForm<CreateTaskSchema>({
    resolver: zodResolver(createTaskSchema),
    defaultValues: {
      days: [...status()],
      repeat: false,
      startAt: date.format("YYYY-MM-DD"),
      endAt: date.add(7 * 2, "day").format("YYYY-MM-DD"),
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

    const res = await api.post("/tasks", createTaskData);

    if (!res.data.error) {
      toast.success("Criado com sucesso!P");
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
    addTask,
  };
};
