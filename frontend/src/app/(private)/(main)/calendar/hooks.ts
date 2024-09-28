import { api } from "@/api";
import { zodResolver } from "@hookform/resolvers/zod";
import dayjs from "dayjs";
import { useForm } from "react-hook-form";
import { z } from "zod";

const createTaskSchema = z.object({
  name: z.string(),
  days: z.array(z.boolean()),
  repeat: z.boolean(),
  startAt: z.string(),
  endAt: z.string(),
});

export type CreateTaskSchema = z.infer<typeof createTaskSchema>;

type CreateTask = {
  name: string;
  days: number[];
  repeat: "weekly" | false;
  startAt: Date | string;
  endAt: Date | string;
};

export const useAddTask = () => {
  const date = dayjs();

  const form = useForm<CreateTaskSchema>({
    resolver: zodResolver(createTaskSchema),
    defaultValues: {
      days: [],
      repeat: false,
      startAt: date.format("YYYY-MM-DD"),
      endAt: date.add(7 * 2, "day").format("YYYY-MM-DD"),
    },
  });

  const addTask = async (data: CreateTaskSchema) => {
    const { name, days, repeat, ...temp } = data;
    const { startAt, endAt } = temp;

    const daysInIndex = days
      ?.map((day, index) => (!!day ? index : null))
      ?.filter((vl) => typeof vl === "number");

    const createTaskData = {
      repeat: !!repeat ? "weekly" : false,
      startAt: new Date(startAt),
      endAt: new Date(endAt),
      days: daysInIndex,
      name: name,
    } satisfies CreateTask;

    const res = await api.post("/tasks", createTaskData);

    console.log(res);
  };

  return {
    form,
    addTask,
  };
};
