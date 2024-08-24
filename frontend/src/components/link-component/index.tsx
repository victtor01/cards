import { getUpload } from "@/utils/get-upload";
import { FaFile, FaFolder } from "react-icons/fa";
import { memo } from "react";
import Image from "next/image";
import Link from "next/link";
import { type } from "os";
import src from "react-textarea-autosize";

type Icon = "file" | "folder";

type Props = {
  name: string | null | undefined;
  background: string | null | undefined;
  href: string;
  type?: Icon;
};

const LinkComponent = (props: Props) => {
  const { background, href = "#", name = "", type = "folder" } = props;
  const backgroundImage = getUpload(background);

  return (
    <Link
      href={href}
      className="w-full max-w-[12rem] mx-1 group/link mb-2 rotate opacity-90 hover:opacity-100 h-auto overflow-hidden min-h-[12rem] rounded-lg bg-zinc-100 dark:bg-zinc-900 shadow-md dark:shadow-black dark:border dark:border-zinc-800 dark:border-opacity-60 hover:shadow-lg"
    >
      <div className="bg-zinc-200 dark:bg-zinc-800 h-[50%] relative overflow-hidden">
        {backgroundImage && (
          <Image
            quality={10}
            src={backgroundImage}
            alt="background"
            objectFit="cover"
            fill
            className="blur-sm dark:brightness-75"
          />
        )}

        <div className="absolute w-full h-full top-0 left-0 z-20 text-zinc-800 dark:text-zinc-500 grid place-items-center">
          <div className="bg-zinc-100 dark:bg-zinc-900 p-3 rounded-md relative z-20 border border-transparent dark:border-zinc-800">
            {type === "file" ? <FaFile size={18} /> : <FaFolder size={18} />}
          </div>
        </div>
      </div>
      <div className="p-2 font-semibold text-zinc-500 relative">
        <header>{name}</header>
        <section className="flex-1 mt-2">
          <div className="flex flex-col">
            <span className="text-sm">CreatedAt</span>
            <div className="">{}</div>
          </div>
        </section>
      </div>
    </Link>
  );
};

export default memo(LinkComponent);
