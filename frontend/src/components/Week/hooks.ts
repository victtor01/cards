import "dayjs/locale/pt-br";

import { api } from "@/api";
import { ITask } from "@/interfaces/ITask";
import { queryClient } from "@/providers/query-client";
import { useQuery } from "@tanstack/react-query";
import dayjs, { Dayjs } from "dayjs";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

dayjs.locale("pt-br");
type MdlOption = "new" | null | undefined;
const LINK_NAME = "mdl-option";
const DETAIL_NAME = "mdl-detail";

const useWeek = () => {
  const searchParams = useSearchParams();
  const startAtInitial = searchParams.get("startAt")
    ? dayjs(searchParams.get("startAt"))
    : null;

  const [visibleConclued, setVisibleConclued] = useState<boolean>(true);
  const [startOf, setStartOf] = useState<Dayjs>(
    startAtInitial || dayjs().startOf("week")
  );
  const [endOf, setEndOf] = useState<Dayjs>(
    startAtInitial?.endOf("week") || dayjs().endOf("week")
  );
  const router = useRouter();

  const taskIdDetail = searchParams.get(DETAIL_NAME);

  const handleVisibleConcluedItems = () => {
    setVisibleConclued((prev) => !prev);
  };

  const next = () => {
    setStartOf((prev) => {
      router.push(`?startAt=${prev.add(1, "week").format("YYYY-MM-DD")}`);
      return prev.add(1, "week");
    });

    setEndOf((prev) => prev.add(1, "week"));
  };

  const back = () => {
    setStartOf((prev) => prev.subtract(1, "week"));
    setEndOf((prev) => prev.subtract(1, "week"));
  };

  const handleNow = () => {
    setStartOf(dayjs().startOf("week"));
    setEndOf(dayjs().endOf("week"));
    router.push("?");
  };

  const openDetail = (taskId: string) => {
    router.push(`?${DETAIL_NAME}=${taskId}`);
  };

  const { data: tasks, isLoading } = useQuery<ITask[]>({
    queryKey: [
      "tasks",
      startOf.format("YYYY-MM-DD"),
      endOf.format("YYYY-MM-DD"),
    ],
    queryFn: async () => {
      const start = startOf.format("YYYY-MM-DD");
      const end = endOf.format("YYYY-MM-DD");

      return (
        (await api.get(`/tasks?startAt=${start}&endAt=${end}`)).data || null
      );
    },
  });

  const completeTask = async (taskId: string, date: string) => {
    const task = tasks?.filter((task) => task.id === taskId)[0];
    if (!task) return;

    const includesInCompleted = task?.completed?.includes(date) || null;

    const prevTasks = task?.completed || [];
    const newArray = includesInCompleted
      ? prevTasks.filter((datePrev) => datePrev !== date)
      : [...prevTasks, date];

    await api.put(`/tasks/completed/${taskId}`, { arrayToConclude: newArray });
    await queryClient.invalidateQueries({ queryKey: ["tasks"] });
  };

  const daysArray = Array.from(
    { length: endOf.diff(startOf, "day") + 1 },
    (_, i) => startOf.add(i, "day").format("MM/DD/YYYY")
  );

  const params = useSearchParams();
  const modal: MdlOption = (params.get(LINK_NAME) as MdlOption) || null;

  return {
    handles: { next, back, handleNow, openDetail, handleVisibleConcluedItems },
    states: { startOf, endOf, daysArray, modal, visibleConclued },
    data: { isLoading, tasks, completeTask },
    params: { taskIdDetail },
  };
};

export { useWeek };

