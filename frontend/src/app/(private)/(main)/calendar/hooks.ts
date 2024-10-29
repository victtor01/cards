import { api } from "@/api";
import { queryClient } from "@/providers/query-client";
import { TaskSchema } from "@/schemas/task-schema";
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

  const addTask = async (data: TaskSchema) => {
    const { name, days, repeat, description, ...temp } = data;
    const { startAt, hour } = temp;

    const endAt = repeat ? (temp.endAt ? new Date(temp.endAt) : null) : null;

    const daysInIndex = days
      ?.map((day, index) => (!!day ? index : null))
      ?.filter((vl) => typeof vl === "number");

    const createTaskData = {
      repeat: !!repeat ? "weekly" : null,
      startAt: startAt,
      endAt: endAt,
      hour: hour,
      name: name,
      days: daysInIndex,
      description: description,
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

  return {
    addTask,
  };
};
