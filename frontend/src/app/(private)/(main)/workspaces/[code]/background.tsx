import { ModalToUploadBackground } from "@/components/uploads-background-workspace";
import { fontFiraCode } from "@/fonts";
import Image from "next/image";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { IoClose } from "react-icons/io5";
import { MdImage } from "react-icons/md";
import { motion } from "framer-motion";
import { getUpload } from "@/utils/get-upload";
import { useBackground } from "./hooks";
import { queryClient } from "@/providers/query-client";
import { api } from "@/api";
import { get } from "http";
import { type } from "os";
import src from "react-textarea-autosize";

type BackgroundProps = {
  photoUrl: string | null | undefined;
  workspaceId: string;
};

type Modal = "upload" | "delete" | null;

const update = async ({ file, code }: any) => {
  if (!file) return;

  const formData = new FormData();
  formData.append("background", file);

  await api.put(`/workspaces/background/id/${code}`, formData);

  await queryClient.refetchQueries({
    queryKey: ["workspaces"],
  });
};

const Upload = () => {
  const router = useRouter();
  const { code } = useParams();
  const params = useSearchParams();
  const modal: Modal = (params.get("md") as Modal) || null;

  return (
    <div className="flex w-full border-b-2 border-dashed overflow-visible relative bg-zinc-100 px-3 dark:bg-zinc-900 dark:border-zinc-700">
      <div className="mx-auto relative max-w-main w-full p-3">
        <button
          onClick={() => router.push("?md=upload")}
          className="absolute bg-white px-2 p-1 shadow rounded text-zinc-500 bottom-0 translate-y-[50%] left-0 opacity-90 hover:opacity-100 hover:scale-[1.02] hover:shadow-lg duration-[0.2s] transition-[shadow_scale] dark:bg-zinc-800 dark:shadow-black dark:border dark:border-zinc-700 dark:text-zinc-400"
        >
          <span className={`${fontFiraCode}`}>upload image</span>
          {code.toString()}
        </button>
      </div>

      {modal === "upload" && (
        <ModalToUploadBackground
          update={({ file }) => update({ file, code })}
        />
      )}
    </div>
  );
};

const Show = ({ photoUrl }: { photoUrl: string }) => {
  const router = useRouter();
  const params = useSearchParams();
  const image = getUpload(photoUrl);
  const { code } = useParams();
  
  const background = useBackground();

  const modal: Modal = (params.get("md") as Modal) || null;

  return (
    <div className="bg-zinc-200 dark:bg-zinc-800 flex w-full h-[30vh] relative group/background z-10 shadow dark:shadow-black">
      <div className="w-full flex-1 flex h-full group-hover/background:dark:brightness-50 group-hover/background:brightness-[0.8] relative transition-all">
        {image && <Image src={image} alt="photo" fill objectFit="cover" />}
      </div>
      <div className="w-full top-0 left-0 h-full z-10 absolute p-2 group-hover/background:backdrop-blur-md m-auto bg-transparent flex opacity-0 group-hover/background:opacity-100 transition-all">
        <div className="flex m-auto gap-2">
          <motion.button
            type="button"
            onClick={() => background.deleteBackground()}
            whileHover={{ scale: 1.05 }}
            className="p-2 px-4 hover:bg-zinc-200 shadow dark:hover:bg-zinc-700 bg-white text-rose-600 dark:bg-zinc-800 rounded flex items-center gap-2"
          >
            <IoClose />
            <span className={fontFiraCode}>delete</span>
          </motion.button>
          <motion.button
            onClick={() => router.push("?md=upload")}
            whileHover={{ scale: 1.05 }}
            className="p-2 px-4 hover:bg-zinc-200 shadow dark:hover:bg-zinc-700 bg-white dark:bg-zinc-800 rounded text-indigo-500 flex items-center gap-2"
          >
            <MdImage />
            <span className={fontFiraCode}>update</span>
          </motion.button>
        </div>
      </div>

      {modal === "upload" && (
        <ModalToUploadBackground
          update={({ file }) => update({ file, code })}
        />
      )}
    </div>
  );
};

export function Background({ photoUrl, workspaceId }: BackgroundProps) {
  return !!photoUrl ? <Show {...{ photoUrl, workspaceId }} /> : <Upload />;
}
