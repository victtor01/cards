import Link from "next/link";
import { Editor } from "../editor/editor";
import { fontFiraCode, fontOpenSans } from "@/fonts";
import { BiPhotoAlbum } from "react-icons/bi";

export function CreateWorkspace() {
  return (
    <div className="w-full h-screen overflow-auto bg-black bg-opacity-50 fixed top-0 left-0 z-20 flex flex-col pb-20 backdrop-blur-sm">
      <div className="block mx-auto bg-zinc-900 border border-zinc-900 border-opacity-60 rounded-xl mt-[5rem] max-w-[65rem] w-full h-auto">
        <header className="w-full border-b border-zinc-700 p-4 flex justify-between">
          <div className={`${fontOpenSans} text-lg text-zinc-300`}>Edit your card...</div>
          <div>
            <Link href={"?"} className="opacity-90 hover:opacity-100">
              Close
            </Link>
          </div>
        </header>

        <section className="w-full h-[15rem] bg-indigo-600 relative">
          <button className="flex m-3 absolute bg-zinc-800 p-2 px-4 shadow-md shadow-black rounded border border-zinc-600 opacity-70 items-center gap-3 hover:opacity-100">
            <BiPhotoAlbum/> 
            <span className={`${fontFiraCode} text-zinc-200 capitalize text-sm`}>
              uplaod
            </span>
          </button>
        </section>
        
        <Editor />

        <footer className="w-full p-4 border-t border-zinc-800">
          <button className="p-2 px-5 bg-indigo-700 text-white rounded-md opacity-90 hover:opacity-100">
            <span className={fontFiraCode}>
              Save
            </span>
          </button>
        </footer>
      </div>
    </div>
  );
}
