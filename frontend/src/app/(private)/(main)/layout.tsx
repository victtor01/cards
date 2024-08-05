import { Sidebar } from "@/components/main-layout/main-sidebar";
import { usePathname } from "next/navigation";
import { useRouter } from "next/router";

type LayoutMainProps = {
  children: React.ReactNode;
};

export default function LayoutMain({ children }: LayoutMainProps) {
  return (
    <section className="flex w-full h-screen overflow-auto">
      <Sidebar />
      {children}
    </section>
  );
}
