import { api } from "@/api";
import { queryClient } from "@/providers/query-client";
import { TaskSchema } from "@/schemas/task-schema";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

type CreateTask = {
  name: string;
  days: number[];
  description: string | null;
  hour: string | null | undefined;
  repeat: "weekly" | null;
  startAt: Date | string;
  endAt: Date | string | null;
};

export const useAddTask = () => {
  const router = useRouter();

  const createTaskAndToastNotification = async (createTaskData: CreateTask) => {
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

  const getDaysInArrayOfBoolean = (array: boolean[]): number[] => {
    const daysInIndex = array
      ?.map((day, index) => (!!day ? index : null))
      ?.filter((vl) => typeof vl === "number");

    return daysInIndex;
  };

  const createDtoOfTask = (data: TaskSchema): CreateTask => {
    const { name, days, repeat, description, ...timeEvent } = data;
    const { startAt, hour, endAt } = timeEvent;

    const newEndAt = repeat && endAt ? dayjs(endAt).format("YYYY-MM-DD") : null;
    const daysInIndex = getDaysInArrayOfBoolean(days);

    const createTaskData = {
      repeat: !!repeat ? "weekly" : null,
      startAt: startAt,
      endAt: newEndAt,
      hour: hour,
      name: name,
      days: daysInIndex,
      description: description,
    } satisfies CreateTask;

    return createTaskData;
  };

  const addTask = async (data: TaskSchema) => {
    const dataToCreate = createDtoOfTask(data);
    
    await createTaskAndToastNotification(dataToCreate);
  };

  return {
    addTask,
  };
};
