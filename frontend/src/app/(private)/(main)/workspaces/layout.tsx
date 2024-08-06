import { fontValela } from "@/fonts";
import Link from "next/link";
import { useParams } from "next/navigation";
import { BiPlus } from "react-icons/bi";
import { ButtonWithModals } from "./modals";

type LayoutProps = {
  children: React.ReactNode;
};

export default function Layout({ children }: LayoutProps) {
  return (
    <>
      <div className="w-full flex flex-col flex-1">
        <header className="p-1 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex flex-1 px-2">
            <span className={`${fontValela} text-zinc-400`}>Workspace</span>
          </div>
          <div className="flex gap-3">
            <ButtonWithModals />
          </div>
        </header>
        <div className="w-full flex-1 flex flex-col">{children}</div>
      </div>
    </>
  );
}
