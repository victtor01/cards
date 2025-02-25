import { ITask } from "@/interfaces/ITask";
import { useFormContext } from "react-hook-form";

type UpdateTaskFormProps = { task: ITask }

const useUpdateTaskForm = () => {
  const { register } = useFormContext();
}

export function UpdateTaskForm(props: UpdateTaskFormProps) {
  const { task } = props;
  
}