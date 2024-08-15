import { ModalToUploadWorkspace } from "@/components/uploads-background-workspace";
import { fontFiraCode } from "@/fonts";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { IoClose } from "react-icons/io5";

type BackgroundProps = {
  photoUrl: string | null | undefined;
};

const UploadWorkspace = () => {
  const router = useRouter();
  const params = useSearchParams();
  const model = !!params.get("md");

  return (
    <>
      {model && <ModalToUploadWorkspace />}

      <div className="flex w-full border-b-2 border-dashed overflow-visible relative bg-zinc-100 px-3 dark:bg-zinc-800 dark:border-zinc-700">
        <div className="mx-auto relative max-w-main w-full p-3">
          <button
            onClick={() => router.push("?md=upload")}
            className="absolute bg-white px-2 p-1 shadow rounded text-zinc-500 bottom-0 translate-y-[50%] left-0 opacity-90 hover:opacity-100 hover:scale-[1.02] hover:shadow-lg duration-[0.2s] transition-[shadow_scale] dark:bg-zinc-700 dark:shadow-black dark:border dark:border-zinc-600 dark:text-zinc-400"
          >
            <span className={`${fontFiraCode}`}>upload image</span>
          </button>
        </div>
      </div>
    </>
  );
};

export function Background({ photoUrl }: BackgroundProps) {
  if (!photoUrl) return <UploadWorkspace />;

  return (
    <div className="bg-zinc-200 dark:bg-zinc-800 flex  w-full h-[30vh] relative hover:brightness-50 transition-all group/background">
      <div>
        <Image
          quality={1}
          src={`http://localhost:9000/uploads/${photoUrl}`}
          alt="photo"
          fill
          objectFit="cover"
        />
      </div>
      <div className="w-full top-0 left-0 h-full p-2 group-hover/background:dark:backdrop-blur-md  z-40 m-auto">

      </div>
    </div>
  );
}
