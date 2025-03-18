import { fontFiraCode } from "@/fonts";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChangeEvent, useState } from "react";
import { IoClose } from "react-icons/io5";
import { Modal } from "../modal-template";

interface UpdateFunctionProps {
  file: any;
}

interface UpdateBackgroundProps {
  update: (data: UpdateFunctionProps) => Promise<any>;
}

const useUpdateBackground = () => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

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
    preview,
    onChangeFile,
  };
};

export const ModalToUploadBackground = ({ update }: UpdateBackgroundProps) => {
  const router = useRouter();

  const { file, onChangeFile, preview } = useUpdateBackground();

  return (
    <Modal.Container className="p-5 m-auto">
      <header className="flex justify-between items-center">
        <div className={fontFiraCode}>
          <h1>Novo foto de fundo</h1>
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
              <Image
                fill
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
          onClick={async () => {
            await update({ file });
            router.push("?");
          }}
          disabled={!file}
          data-ok={!!file}
          className="p-2 bg-indigo-600 text-white w-full rounded opacity-40 transition-opacity data-[ok=true]:hover:opacity-100"
        >
          <span className={fontFiraCode}>Go</span>
        </button>
      </footer>
    </Modal.Container>
  );
};
