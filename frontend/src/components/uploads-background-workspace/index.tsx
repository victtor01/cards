import { api } from "@/api";
import { fontFiraCode } from "@/fonts";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { ChangeEvent, ChangeEventHandler, useState } from "react";
import { IoClose } from "react-icons/io5";

const useUploadWorkspace = () => {
  const { code } = useParams();

  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const update = async () => {
    if (!file || !code) return;

    const formData = new FormData();
    formData.append("background", file);

    const res = await api.put(`/workspaces/background/${code}`, formData);

    console.log(res);
  };

  const onChangeFile = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.currentTarget.files?.[0] || null;
    setFile(selectedFile);

    if (!selectedFile) return;

    const objectUrl = URL.createObjectURL(selectedFile);

    setPreview(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  };

  return {
    file,
    update,
    preview,
    onChangeFile,
  };
};

export const ModalToUploadWorkspace = () => {
  const { file, update, onChangeFile, preview } = useUploadWorkspace();

  return (
    <div className="fixed top-0 left-0 flex w-full h-screen overflow-auto bg-black bg-opacity-10 backdrop-blur-md z-30">
      <div className="bg-white dark:bg-zinc-800 p-8 m-auto rounded w-full max-w-[30rem] flex flex-col gap-2">
        <header className="flex justify-between items-center">
          <div className={fontFiraCode}>
            <h1>Upload new background</h1>
          </div>
          <div>
            <Link
              href="?"
              className="w-8 h-8 grid place-items-center bg-white dark:bg-zinc-700 rounded-md"
            >
              <IoClose />
            </Link>
          </div>
        </header>
        <section className="mt-4">
          <div className="relative w-full h-[10rem] bg-zinc-100 hover:shadow-xl dark:bg-zinc-700 dark:bg-opacity-50 rounded-lg shadow-inner dark:shadow-black dark:hover:shadow-xl">
            <input
              type="file"
              className="hidden"
              id="file-upload"
              onChange={onChangeFile}
            />
            <label
              htmlFor="file-upload"
              className="z-20 flex flex-col-reverse items-center justify-center w-full h-full cursor-pointer p-4 "
            >
              {preview ? (
                <img
                  src={preview}
                  alt="File preview"
                  className="w-full h-full object-cover rounded-lg"
                />
              ) : (
                <>
                  <p className="z-10 text-xs font-light text-center text-gray-500">
                    Drag & Drop your files here
                  </p>
                  <svg
                    className="z-10 w-8 h-8 text-indigo-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z"></path>
                  </svg>
                </>
              )}
            </label>
          </div>
        </section>
        <footer className="w-full mt-4">
          <button
            onClick={update}
            disabled={!file}
            data-ok={!!file}
            className="p-2 bg-indigo-600 text-white w-full rounded opacity-40 transition-opacity data-[ok=true]:hover:opacity-100"
          >
            <span className={fontFiraCode}>Go</span>
          </button>
        </footer>
      </div>
    </div>
  );
};
