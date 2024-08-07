"use client";

import { Editor } from "@/components/editor/editor";
import { useCreateCard } from "./hooks";
import { Controller } from "react-hook-form";
import TextareaAutosize from "react-textarea-autosize";
import { BiArrowBack } from "react-icons/bi";
import { useRouter } from "next/navigation";

export default function Create() {
  const { form } = useCreateCard();
  const { control } = form;
  const router = useRouter();

  return (
    <div className="w-full h-auto">
      <header className="w-full p-2 flex gap-3 items-center">
        <button 
        onClick={() => router.back()}
        className="bg-zinc-800 opacity-70 hover:opacity-100 p-3 rounded">
          <BiArrowBack />
        </button>

        <div className="flex">
          <Controller
            control={control}
            name="name"
            render={({ field }) => {
              return (
                <input
                  {...field}
                  placeholder="This is my new project..."
                  className="bg-transparent outline-none placeholder:text-zinc-600 text-lg"
                />
              );
            }}
          />
        </div>
      </header>
      <div className="flex mx-auto w-full flex-col max-w-[65rem] mt-20">
        <header className="flex gap-4">
          <Controller
            control={control}
            name="name"
            render={({ field }) => {
              return (
                <TextareaAutosize
                  {...field}
                  placeholder="This is my new project..."
                  className="bg-transparent border border-transparent outline-none w-full text-6xl placeholder:text-zinc-700 break-word text-zinc-300 resize-none"
                />
              );
            }}
          />
        </header>

        <Editor />
      </div>
    </div>
  );
}
