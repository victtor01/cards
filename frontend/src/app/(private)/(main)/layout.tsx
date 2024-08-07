import { Sidebar } from "@/components/main-layout/main-sidebar";
import { usePathname } from "next/navigation";
import { useRouter } from "next/router";
import { ReactNode } from "react";

type LayoutMainProps = {
  children: React.ReactNode;
};

export default function LayoutMain({ children }: LayoutMainProps) {
  return (
    <section className="flex w-full h-screen bg-neutral-900 bg-opacity-60">
      <Sidebar />
      <div className="flex flex-col h-screen overflow-auto w-full scroll-default">
        {children}
      </div>
    </section>
  );
}
