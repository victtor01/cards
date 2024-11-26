import { ITask } from "@/interfaces/ITask";
import { motion } from "framer-motion";
import dayjs from "dayjs";
import { CgCheck } from "react-icons/cg";
import { api } from "@/api";
import { queryClient } from "@/providers/query-client";
import { toast } from "react-toastify";
import { useRouter, useSearchParams } from "next/navigation";
import { fontFiraCode } from "@/fonts";
dayjs.locale("pt-br");

type AllTasksForDayProps = {
  task: ITask;
  day: string;
};

const DETAIL_NAME = "mdl-detail";

const useTaskItem = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const taskIdDetail = searchParams.get(DETAIL_NAME);

  const addOrRemoveDate = (task: ITask, date: string) => {
    const includesInCompleted = task?.completed?.includes(date) || null;
    const prevTasks = task?.completed || [];
    const newArray = includesInCompleted
      ? prevTasks.filter((datePrev) => datePrev !== date)
      : [...prevTasks, date];

    return newArray;
  };

  const completeTask = async (task: ITask, date: string) => {
    try {
      const arrayToConclude = addOrRemoveDate(task, date);
      await api.put(`/tasks/completed/${task.id}`, { arrayToConclude });
      await queryClient.invalidateQueries({ queryKey: ["tasks"] });
    } catch (error) {
      toast.error("Houve um erro ao tentar atualizar task!");
    }
  };

  const openDetail = (taskId: string) => {
    router.push(`?${DETAIL_NAME}=${taskId}`);
  };

  return {
    completeTask,
    openDetail,
    params: { taskIdDetail },
  };
};

const TaskItem = (props: AllTasksForDayProps) => {
  const { completeTask, openDetail, params } = useTaskItem();
  const { taskIdDetail } = params;
  const { task, day } = props;

  const selectedLink = taskIdDetail === task.id;

  const completed =
    task?.completed?.includes(dayjs(day).format("YYYY-MM-DD")) || false;

  const diffInDays =
    !!task.startAt && !!task.endAt
      ? dayjs(task.endAt, "YYYY-MM-DD").diff(
          dayjs(task.startAt, "YYYY-MM-DD"),
          "day"
        )
      : null;

  const diffWeekFormat = diffInDays !== null ? Math.ceil(diffInDays / 7) : null;

  const quantityOfTasks =
    !!task.startAt && !!task.endAt && diffInDays
      ? new Array(diffInDays).fill(null).reduce((count, _, i) => {
          const currentDay = dayjs(task.startAt, "YYYY-MM-DD").add(i, "day");
          return (
            count + (task.days.includes(currentDay.day().toString()) ? 1 : 0)
          );
        }, 0)
      : 0;

    console.log(task)

  const percentage =
    !!task.completed?.length && quantityOfTasks
      ? Math.ceil((task.completed.length / quantityOfTasks) * 100)
      : 0;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      data-completed={completed}
      data-linkselected={!!taskIdDetail && !selectedLink}
      className="flex flex-col relative gap-1 p-1 overflow-visible rounded z-[0] 
      data-[linkselected=true]:blur-[2px] items-center data-[linkselected=true]:opacity-50 
      hover:bg-zinc-100 hover:dark:bg-neutral-900 data-[completed=true]:border-indigo-600 
      dark:data-[completed=true]:border-indigo-600 transition-none group
      dark:border-zinc-800"
    >
      <div className="flex gap-3 w-full">
        <button
          onClick={() => completeTask(task, dayjs(day).format("YYYY-MM-DD"))}
          type="button"
          data-completed={completed}
          className="min-w-6 min-h-4 text-white bg-zinc-200 dark:bg-zinc-900 data-[completed=true]:bg-indigo-600 
            dark:data-[completed=true]:bg-indigo-600  rounded grid place-items-center border dark:border-zinc-700/70"
        >
          {completed && (
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <CgCheck />
            </motion.div>
          )}
        </button>
        <button
          onClick={() => openDetail(task.id)}
          data-completed={completed}
          className={`${fontFiraCode} overflow-hidden whitespace-nowrap text-ellipsis text-md text-start gap-1 
          data-[completed=true]:line-through data-[completed=true]:opacity-70 flex-1`}
        >
          {task.name}
        </button>
        <div className="flex items-center gap-3 pointer-events-none">
          <div className="p-1 px-2 bg-zinc-100 dark:bg-zinc-800 rounded text-xs whitespace-nowrap flex opacity-60">
            {task?.hour?.toString() || "Sem horário"}
          </div>
          <div className="gap-1 items-center absolute top-[100%] z-40 left-[2rem] bg-indigo-600 text-zinc-200 px-2 rounded shadow dark:shadow-black group-hover:flex hidden text-sm flex-1">
            {task?.endAt && <span>{percentage?.toString()}%</span>}
          </div>
          {task?.color && (
            <span
              className="w-4 h-4 rounded"
              style={{ background: task.color }}
            />
          )}
        </div>
      </div>

      {diffWeekFormat && (
        <div className="flex left-0 bg-zinc-200 dark:bg-zinc-700 h-[0.2rem] opacity-70 group-hover:opacity-100 group-hover:h-2 transition-all w-full rounded-[2px] overflow-hidden">
          <motion.div
            layout
            style={{ width: `${percentage}%` }}
            className={`bg-gradient-to-r group-hover:rounded-r-[2px] from-indigo-500 rounded-none dark:from-indigo-500 to-violet-500 dark:to-violet-600 h-full`}
          />
        </div>
      )}
    </motion.div>
  );
};

export { TaskItem };
