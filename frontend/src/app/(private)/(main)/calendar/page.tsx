import { Week } from "@/components/Week";

export default function Calendar() {
  return (
    <div className="w-full max-w-[75rem] flex gap-2 p-5 bg-transparent mx-auto">
      <Week />
    </div>
  );
}
