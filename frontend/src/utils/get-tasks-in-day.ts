import { ITask } from "@/interfaces/ITask";
import dayjs from "dayjs";

export function GetTasksInDay(tasks: ITask[], day: string) {
  const dayOfWeek = dayjs(day).day();

  const newArrayOfTasks = tasks?.filter((task: ITask) => {
    const taskEndAt = task?.endAt ? new Date(task.endAt) : null;

    const taskStartAt = task?.startAt
      ? new Date(task.startAt)
      : null;

    const currentDay = new Date(dayjs(day).format("YYYY-MM-DD"));
    const taskCompletedOnCurrentDay = task?.completed?.includes(
      dayjs(day).format("YYYY-MM-DD")
    );

    const taskIsForToday = task.days.includes(dayOfWeek.toString());

    const taskIsWithinDateRange =
      taskEndAt &&
      taskEndAt > new Date(currentDay) &&
      (!taskStartAt || currentDay >= taskStartAt);

    return (
      (taskEndAt
        ? taskIsForToday && taskIsWithinDateRange
        : taskIsForToday)
    );
  })
  .sort(
    (a, b) =>
      new Date(a.createdAt).getTime() -
      new Date(b.createdAt).getTime()
  );

  return newArrayOfTasks;
}