import { fontFiraCode } from "@/fonts";

type BaseProps = {
  children: React.ReactNode;
};

type ContainerProps = {
  title: string,
} & BaseProps

const Container = ({ children, title }: ContainerProps) => (
  <div className="bg-zinc-800 p-3 w-full max-w-[20rem] rounded-md shadow-lg shadow-black">
    <header className="text-md text-zinc-300">
      <h1 className={fontFiraCode}>
        {title}
      </h1>
    </header>
    <section>
      {children}
    </section>
  </div>
);

const DashboardCard = {
  Container
}

export default DashboardCard