import { fontFiraCode } from "@/fonts";

type BaseProps = {
  children: React.ReactNode;
};

type ContainerProps = {
  title: string,
} & BaseProps

const Container = ({ children, title }: ContainerProps) => (
  <div className="bg-white shadow dark:bg-neutral-900 p-3 w-full max-w-[20rem] rounded-md dark:shadow-black">
    <header className="text-md text-zinc-600 dark:text-zinc-300">
      <h1 className={fontFiraCode}>
        {title}
      </h1>
    </header>
    <section className="text-zinc-600 dark:text-zinc-200">
      {children}
    </section>
  </div>
);

const DashboardCard = {
  Container
}

export default DashboardCard