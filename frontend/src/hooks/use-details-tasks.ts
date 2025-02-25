import { api } from "@/api";
import { ITask } from "@/interfaces/ITask";
import { queryClient } from "@/providers/query-client";
import { TaskSchema } from "@/schemas/task-schema";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

type useDetailsTasksProps = {
  taskId: string;
};

export const useDetailsTasks = ({ taskId }: useDetailsTasksProps) => {
  const router = useRouter();

  const { data: task, isLoading } = useQuery<ITask>({
    queryKey: ["tasks", taskId],
    queryFn: async () => (await api.get(`/tasks/${taskId}`)).data,
  });

  const closeModal = () => {
    router.push("?");
  };

  const deleteTask = async (taskId: string) => {
    try {
      await api.delete(`/tasks/${taskId}`);
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      toast.success("Task deletada com sucesso!");
    } catch (error) {
      toast.error("Houve um erro ao excluir task!");
    }

    closeModal();
  };

  const updateTask = async (data: TaskSchema) => {
    if (!taskId) {
      toast.error("Houve um erro ao tentar atualizar a task!");
      return;
    }

    try {
      await api.put(`/tasks/${taskId}`, {
        ...data,
        repeat: !!data.repeat ? "weekly" : null,
        days: data?.days
          ?.map((day, index) => (!!day ? index : null))
          ?.filter((vl) => typeof vl === "number"),
      });

      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({ queryKey: ["tasks", taskId] });

      toast.success("atualizado com sucesso!");
    } catch (error) {
      toast.error(
        "Houve um erro ao tentar atualizar a task! Atualiza e tente novamente."
      );
    }

    closeModal();
  };

  return {
    updateTask,
    isLoading,
    deleteTask,
    task,
  };
};
