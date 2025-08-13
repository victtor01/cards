import "dayjs/locale/pt-br";

import { getUpload } from "@/utils/get-upload";
import dayjs from "dayjs";
import Image from "next/image";
import { memo } from "react";
import { FaCalendar, FaFile, FaFolder } from "react-icons/fa";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

dayjs.locale("pt-br");

type Icon = "file" | "folder";

type Props = {
  name: string | null | undefined;
  background: string | null | undefined;
  createdAt?: string | null;
  href: string;
  type?: Icon;
};

const LinkComponent = (props: Props) => {
  const { background, href, name, createdAt, type = "folder" } = props;
  const backgroundImage = getUpload(background);
  const router = useRouter();

  console.log("background", backgroundImage)
  
  return (
    <button
      onClick={() => router.push(href || "#")}
      className="rotate-x 2xl:w-full 2xl:max-w-[10rem] transition-all relative text-left shadow group/link mb-2 opacity-90 hover:opacity-100 h-auto overflow-hidden rounded-lg bg-white hover:shadow-xl dark:bg-zinc-900/60 dark:shadow-black"
    >
      <div className="absolute top-[-1.5rem] left-[30%] z-20 opacity-80 translate-x-[-50%] dark:bg-zinc-700 transition-all bg-gray-200 w-0 h-0 group-hover/link:w-[60%] group-hover/link:h-16 blur-xl rotate-[45deg]"/>

      <header className="bg-zinc-100  min-h-[6rem] dark:bg-zinc-800/70 h-[50%] relative overflow-hidden border dark:border-none rounded-lg m-2">
        {backgroundImage && (
          <Image
            quality={10}
            src={backgroundImage}
            alt="background"
            objectFit="cover"
            fill
            className="dark:brightness-75 rotate-x z-30 scale-[1.05] group-hover/link:scale-[1.1] group-hover/link:blur-0 transition-all blur-[1px]"
          />
        )}
        <div className="absolute z-30 w-full h-full top-0 left-0 text-zinc-800 dark:text-zinc-500 grid place-items-center">
          <div className="bg-white dark:bg-zinc-900 shadow-md dark:shadow-black p-3 rounded-full relative z-20">
            {type === "file" ? <FaFile size={18} /> : <FaFolder size={18} />}
          </div>
        </div>
      </header>
      <div className="px-2 text-zinc-500 relative pb-2">
        <header className="font-semibold">
          <h1 className="text-gray-700 dark:text-white whitespace-nowrap text-ellipsis overflow-hidden">
            {name}
          </h1>
        </header>
        <section className="flex-1 mt-2 pb-2">
          <div className="flex flex-col">
            <span className="text-sm font-normal flex items-center gap-1">
              <FaCalendar size={10} />
              Criado em
            </span>
            <div className="text-xs flex gap-1 items-center">
              {dayjs(createdAt).format("DD [de] MMM [de] YYYY")}
            </div>
          </div>
        </section>
      </div>
    </button>
  );
};

export default memo(LinkComponent);
