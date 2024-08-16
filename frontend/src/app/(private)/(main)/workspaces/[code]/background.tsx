import { ModalToUploadWorkspace } from "@/components/uploads-background-workspace";
import { fontFiraCode } from "@/fonts";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { IoClose } from "react-icons/io5";
import { MdImage } from "react-icons/md";
import { motion } from "framer-motion";
import { GetUpload } from "@/utils/get-upload";
import { FaUser } from "react-icons/fa";

type BackgroundProps = {
  photoUrl: string | null | undefined;
};

const Upload = () => {
  const router = useRouter();

  const params = useSearchParams();
  const modal = !!params.get("md");

  return (
    <div className="flex w-full border-b-2 border-dashed overflow-visible relative bg-zinc-100 px-3 dark:bg-zinc-800 dark:border-zinc-700">
      <div className="mx-auto relative max-w-main w-full p-3">
        <button
          onClick={() => router.push("?md=upload")}
          className="absolute bg-white px-2 p-1 shadow rounded text-zinc-500 bottom-0 translate-y-[50%] left-0 opacity-90 hover:opacity-100 hover:scale-[1.02] hover:shadow-lg duration-[0.2s] transition-[shadow_scale] dark:bg-zinc-700 dark:shadow-black dark:border dark:border-zinc-600 dark:text-zinc-400"
        >
          <span className={`${fontFiraCode}`}>upload image</span>
        </button>
      </div>

      {modal && <ModalToUploadWorkspace />}
    </div>
  );
};

const Show = ({ photoUrl }: { photoUrl: string | null }) => {
  const router = useRouter();
  const params = useSearchParams();
  const image = GetUpload(photoUrl);
  
  const modal = !!params.get("md");

  return (
    <div className="bg-zinc-200 dark:bg-zinc-800 flex w-full h-[30vh] relative group/background z-10 shadow dark:shadow-black">
      <div className="w-full flex-1 flex h-full group-hover/background:dark:brightness-50 group-hover/background:brightness-[0.8] relative transition-all">
        {image && <Image src={image} alt="photo" fill objectFit="cover" />}
      </div>
      <div className="w-full top-0 left-0 h-full z-10 absolute p-2 group-hover/background:backdrop-blur-md m-auto bg-transparent flex opacity-0 group-hover/background:opacity-100 transition-all">
        <div className="flex m-auto gap-2">
          <motion.button
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

      {modal && <ModalToUploadWorkspace />}
    </div>
  );
};

export function Background({ photoUrl }: BackgroundProps) {
  return !!photoUrl ? <Show photoUrl={photoUrl} /> : <Upload />;
}
