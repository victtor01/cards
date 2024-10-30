import { fontOpenSans } from "@/fonts";
import { useThemeStore } from "@/hooks/use-theme";
import { GenerateSoundClick } from "@/utils/generate-sound-click";
import { getUpload } from "@/utils/get-upload";
import { AnimatePresence, motion, Variants } from "framer-motion";
import Image from "next/image";
import Cookies from 'js-cookie';
import { useEffect, useState } from "react";
import { BsSoundwave } from "react-icons/bs";
import { FaMoon, FaUser } from "react-icons/fa";
import { IoSettingsSharp } from "react-icons/io5";

type UserComponentProps = {
  photoUrl: string | null;
};

const variantsAnimation = {
  initial: {
    opacity: 0,
    scale: 0.2,
  },
  animate: {
    opacity: 1,
    scale: 1,
  },
} satisfies Variants;

function useTheme() {
  const storeTheme = useThemeStore();
  const cookies = Cookies.get();

  const handleTheme = () => {
    const htmlElement = document.getElementsByTagName("html")[0];
    const newTheme = htmlElement.className === "dark" ? "light" : "dark";

    Cookies.set("_theme", newTheme, {
      path: "/",
    });
    
    storeTheme.setTheme(newTheme);
    htmlElement.className = newTheme;

    storeTheme.setTheme(cookies["_theme"]);
    
    GenerateSoundClick();
  };

  return {
    handleTheme,
  };
}

function useUserComponent() {
  const [show, setShow] = useState<boolean>(false);

  const handleShow = async () => {
    await GenerateSoundClick();

    setShow((prev) => !prev);
  };

  return {
    show,
    handleShow,
  };
}

export function UserComponent({ photoUrl }: UserComponentProps) {
  const { show, handleShow } = useUserComponent();
  const { handleTheme } = useTheme();

  const imageUser = getUpload(photoUrl);

  return (
    <div className="flex gap-3 relative items-center">
      <button
        data-focus={show}
        onClick={handleShow}
        className="overflow-hidden transition-all hover:ring-2 hover:ring-indigo-400 dark:ring-indigo-600 ring-offset-none data-[focus=true]:ring-2 relative w-10 h-10 bg-white text-zinc-300 dark:bg-zinc-800 border dark:border-zinc-700 rounded-[100%] dark:text-zinc-300 grid place-items-center opacity-90 hover:opacity-100"
      >
        {imageUser && (
          <Image
            quality={1}
            src={imageUser}
            alt="photo"
            fill
            objectFit="cover"
          />
        )}

        {!imageUser && (
          <FaUser />
        )}
      </button>
      <AnimatePresence>
        {show && (
          <motion.div
            variants={variantsAnimation}
            initial={"initial"}
            animate={"animate"}
            exit={"initial"}
            className="absolute z-[20] flex flex-col left-[150%] border dark:border-zinc-700 top-[0.5rem] items-center before:content-[''] before:w-[96%] before:rounded-t-xl before:h-1 before:absolute before:bottom-[100%]  before:bg-indigo-600 w-auto h-auto bg-zinc-100 text-gray-600 rounded shadow-xl dark:shadow-black dark:bg-zinc-800 dark:text-zinc-400"
          >
            <div className="flex flex-col text-sm divide-y-2 divide-zinc-100 dark:divide-zinc-700 overflow-hidden rounded">
              <div className="cursor-default w-full">
                <div className="p-1 px-3 bg-indigo-700 text-zinc-300 hover:text-white transition-colors text-xs grid place-items-center">
                  <span className={`${fontOpenSans} font-semibold`}>
                    PREMIUM
                  </span>
                </div>
              </div>

              <button
                onClick={handleTheme}
                className="flex gap-2 items-center whitespace-nowrap opacity-80 hover:opacity-100 hover:bg-zinc-200 p-2 dark:hover:bg-zinc-700"
              >
                <FaMoon />
                <span>Handle Theme</span>
              </button>

              <button className="flex gap-2 items-center whitespace-nowrap opacity-80 hover:opacity-100 hover:bg-zinc-200 p-2 dark:hover:bg-zinc-700">
                <IoSettingsSharp />
                Configurações
              </button>

              <button className="flex gap-2 items-center whitespace-nowrap opacity-80 hover:opacity-100 hover:bg-zinc-200 p-2 dark:hover:bg-zinc-700">
                <BsSoundwave />
                Sons
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
