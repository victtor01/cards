import { fontFiraCode, fontSaira } from "@/fonts";
import { useClickOutside } from "@/hooks/use-click-outside";
import { AnimatePresence, AnimationProps, motion } from "framer-motion";
import { useState } from "react";
import { LuCopy, LuCopyCheck } from "react-icons/lu";
import { MdPublish } from "react-icons/md";
import { useCardPublish, useCardSupress } from "./hooks";
import { Loader } from "../loader";

type PublishButtonProps = { cardId: string; code?: string | null };

const animations = {
  initial: { opacity: 0, y: -120, scale: 0, x: 120 },
  animate: { opacity: 1, y: 0, scale: 1, x: 0 },
  exit: { opacity: 0, y: -120, scale: 0, x: 120 },
} satisfies AnimationProps;

export const PublishButton = ({ cardId, code }: PublishButtonProps) => {
  const [open, setOpen] = useState<boolean>(false);
  const modalRef = useClickOutside<HTMLDivElement>(() => setOpen(false));
  const { publishMutation, isCopied, handleCopy } = useCardPublish();
  const { supressMutation } = useCardSupress();

  return (
    <div ref={modalRef}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="p-1 px-2 z-20 relative text-base bg-gradient-45 from-violet-500 to-indigo-600 rounded text-white opacity-95 hover:shadow-lg hover:shadow-indigo-600/50 hover:opacity-100 dark:text-zinc-100 flex items-center gap-2"
      >
        <MdPublish className="w-6 h-6"/>
        <span className={`${fontFiraCode} lg:flex hidden`}>Publicar</span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            variants={animations}
            initial="initial"
            animate="animate"
            exit="exit"
            className="flex p-6 flex-col bg-white dark:bg-zinc-900 max-w-md rounded-lg right-4 shadow-xl mt-2 flex-1 absolute top-[100%]"
          >
            <div className="flex justify-between items-center">
              <h2
                className={`${fontSaira} font-semibold text-lg text-gray-500 dark:text-gray-300`}
              >
                Publique seu documento!
              </h2>
            </div>

            <div className="mt-4 flex flex-col gap-4">
              <button
                type="button"
                onClick={() => handleCopy(code)}
                data-allowed={!!code?.length}
                className="flex data-[allowed=true]:cursor-pointer data-[allowed=true]:opacity-100 text-gray-500 cursor-not-allowed opacity-60 items-center bg-zinc-100 dark:bg-zinc-800 shadow-inner dark:shadow-black gap-4 p-2 px-5 rounded-lg"
              >
                {!code && (
                  <div className="flex flex-1 mt-2 text-2xl items-center text-center">
                    *******
                  </div>
                )}

                {code && <div className="flex flex-1 items-center">{code}</div>}
                {isCopied && <LuCopyCheck />}
                {!isCopied && <LuCopy />}
              </button>

              <footer className="flex gap-4 items-center">
                <button
                  type="button"
                  disabled={publishMutation.isPending}
                  onClick={() => publishMutation.mutateAsync(cardId)}
                  data-isloading={!!publishMutation.isPending}
                  className="data-[isloading=true]:opacity-60 data-[isloading=true]:pointer-events-none data-[isloading=true]:cursor-default flex items-center gap-4 bg-indigo-500 text-indigo-50 rounded-lg shadow-lg hover:shadow-xl shadow-indigo-500/40 hover:shadow-indigo-500/50 transition-all border-t border-r border-indigo-400 p-2 px-4"
                >
                  {publishMutation.isPending && (
                    <Loader className="w-4 h-4 border-white" />
                  )}
                  <span
                    className={`${fontSaira} font-semibold text-indigo-100 hover:text-white transition-all`}
                  >
                    {!code && "Publicar"}
                    {code && "Republicar"}
                  </span>
                </button>

                {code && (
                  <button
                    type="button"
                    onClick={() => supressMutation.mutateAsync(cardId)}
                    className={`${fontSaira} font-semibold`}
                  >
                    Limpar
                  </button>
                )}
              </footer>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
