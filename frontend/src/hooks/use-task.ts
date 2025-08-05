import { api } from "@/api";
import { ITask } from "@/interfaces/ITask";
import { queryClient } from "@/providers/query-client";
import { toast } from "react-toastify";

interface PropsToConclude {
  id: string;
  dayToComplete: string;
}

const useTask = () => {
  const addOrRemoveDate = (completedArray: string[], date: string) => {
    const includesInCompleted: boolean = completedArray?.includes(date);
    const prevTasks: string[] = completedArray || [];

    const newArray: string[] = includesInCompleted
      ? prevTasks.filter((datePrev) => datePrev !== date)
      : [...prevTasks, date];

    return newArray;
  };

  const completeOfRemoveTask = async (task: ITask, date: string) => {
    try {
      const arrayToConclude = addOrRemoveDate(task.completed, date);
      await api.put(`/tasks/completed/${task.id}`, { arrayToConclude });
      await queryClient.invalidateQueries({ queryKey: ["tasks"] });
    } catch (error) {
      toast.error("Houve um erro ao tentar atualizar task!");
    }
  };

  const complete = async (props: PropsToConclude) => {
    const { id, dayToComplete } = props;

    await api.put<ITask | null>(`/tasks/complete/${id}`, {
      day: dayToComplete,
    });

    await queryClient.invalidateQueries({ queryKey: ["tasks"] });
    await queryClient.invalidateQueries({ queryKey: ["tasks", "lates"] });
  };

  return {
    completeOfRemoveTask,
    complete,
  };
};

export { useTask };
