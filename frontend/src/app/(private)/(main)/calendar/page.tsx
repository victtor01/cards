import { Week } from "@/components/week";
import { fontFiraCode, fontSaira } from "@/fonts";
import { MdViewWeek } from "react-icons/md";
import { DashboardTasks } from "./dashboard";

export default function Calendar() {
  return (
    <div className="w-full flex-col max-w-main flex gap-2 p-5 mx-auto">
      <div className="flex gap-3">
        <div className="flex items-center gap-2 text-gray-500 text-lg font-semibold">
          <MdViewWeek />
          <span className={fontSaira}>Dashboards</span>
        </div>
      </div>
      
      <DashboardTasks />

      <div className="flex gap-3 w-full max-w-main">
        <div className="flex items-center gap-2 text-gray-500 text-lg font-semibold">
          <MdViewWeek />
          <span className={fontSaira}>Minha semana</span>
        </div>
      </div>
      
      <Week />
      
    </div>
  );
}
