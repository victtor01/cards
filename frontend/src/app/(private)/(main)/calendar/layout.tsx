type LayoutWeekProps = {
  children: React.ReactNode;
};

export default function LayoutWeek({ children }: LayoutWeekProps) {
  return (
    <section className="flex w-full h-screen overflow-auto scroll-default dark:bg-neutral-900/40">
      {children}
    </section>
  );
}
