import "dayjs/locale/pt-br";

import { getUpload } from "@/utils/get-upload";
import dayjs from "dayjs";
import Image from "next/image";
import Link from "next/link";
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

  return (
    <motion.button
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      whileTap={{ scale: 0.9 }}
      onTap={() => router.push(href || "#")}
      className="w-full max-w-[12rem] mx-1 text-left group/link mb-2 rotate shadow-2xl transition-shadow opacity-90 hover:opacity-100 h-auto overflow-hidden rounded-lg bg-white dark:bg-zinc-900 dark:shadow-black dark:border dark:border-zinc-800 dark:border-opacity-60 hover:shadow-lg"
    >
      <div className="bg-zinc-100 min-h-[6rem] dark:bg-zinc-800 h-[50%] relative overflow-hidden border dark:border-none dark:shadow dark:border-zinc-800 dark:shadow-black rounded-lg m-2">
        {backgroundImage && (
          <Image
            quality={1}
            src={backgroundImage}
            alt="background"
            objectFit="cover"
            fill
            className="dark:brightness-75"
          />
        )}
        <div className="absolute w-full h-full top-0 left-0 z-20 text-zinc-800 dark:text-zinc-500 grid place-items-center">
          <div className="bg-white dark:bg-zinc-900 shadow-md dark:shadow-black p-3 rounded-full relative z-20">
            {type === "file" ? <FaFile size={18} /> : <FaFolder size={18} />}
          </div>
        </div>
      </div>
      <div className="px-2 text-zinc-500 relative">
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
    </motion.button>
  );
};

export default memo(LinkComponent);
