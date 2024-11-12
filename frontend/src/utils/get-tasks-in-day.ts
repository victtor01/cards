import { ITask } from "@/interfaces/ITask";
import dayjs from "dayjs";

const isRepeatInifiniteTask = ({ startAt, endAt, repeat }: ITask) =>
  !!startAt && !endAt && !!repeat;

const isRepeatFinite = ({ startAt, endAt, repeat }: ITask) =>
  !!startAt && !!endAt && !!repeat;

const isNotRepat = ({ startAt, repeat }: ITask) => !!startAt && !repeat;

export function GetTasksInDay(tasks: ITask[], day: string) {
  const currentDate = dayjs(day);
  const dayOfWeek = dayjs(day).day();

  const newArrayOfTasks = tasks
    ?.filter((task: ITask) => {
      const taskPertencesToIndexDay = task.days.includes(dayOfWeek.toString());

      if (!taskPertencesToIndexDay) return false;

      if (isRepeatInifiniteTask(task)) {
        return true;
      };

      if (isRepeatFinite(task)) {
        const endAt = dayjs(task.endAt);

        const currentDateIsLessTo =
          new Date(endAt.format("YYYY-MM-DD")) >=
          new Date(currentDate.format("YYYY-MM-DD"));

        return currentDateIsLessTo;
      }

      if (isNotRepat(task)) {
        const finalStart = dayjs(task.startAt).endOf("week");

        const currentDateIsLessTo =
          new Date(currentDate.format("YYYY-MM-DD")) <=
          new Date(finalStart.format("YYYY-MM-DD"));

        return currentDateIsLessTo;
      }
    })
    .sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );

  return newArrayOfTasks;
}