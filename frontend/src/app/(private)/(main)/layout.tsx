import { Sidebar } from "@/components/main-layout/main-sidebar";

type LayoutMainProps = {
  children: React.ReactNode;
};

export default function LayoutMain({ children }: LayoutMainProps) {
  return (
    <section className="flex w-full h-screen bg-white dark:bg-neutral-900 dark:bg-opacity-60">
      <Sidebar />
      <div className="flex flex-col h-screen overflow-auto flex-1 scroll-default">
        {children}
      </div>
    </section>
  );
}
