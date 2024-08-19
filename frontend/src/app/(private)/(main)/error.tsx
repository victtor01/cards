"use client";

export default function Error({ error, reset }: any) {
  return (
    <div className="flex flex-col m-auto gap-2">
      <div className="text-xl">{error.message}</div>
      <button
        onClick={() => reset()}
        className="bg-zinc-100 dark:bg-zinc-950 rounded-lg text-zinc-500 dark:text-zinc-200 opacity-90 hover:opacity-100 border border-transparent dark:border-zinc-800 p-2"
      >
        Try again
      </button>
    </div>
  );
}
