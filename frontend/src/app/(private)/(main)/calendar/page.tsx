"use client"

import { Week } from "./week";

export default function Calendar() {
  return (
    <div className="w-full flex gap-2 p-5 bg-transparent">
      <Week />
    </div>
  );
}
