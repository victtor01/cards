import "react-toastify/dist/ReactToastify.css";
import { Sidebar } from "@/components/sidebar/main-sidebar";
import { ToastContainer, Zoom } from "react-toastify";
import MenuButton from "@/components/menu-button-suspense";

type LayoutMainProps = {
  children: React.ReactNode;
};

export default function LayoutMain({ children }: LayoutMainProps) {
  return (
    <section className="flex w-full h-screen bg-gradient-radial from-gray-100 to-white dark:from-neutral-900/70 dark:via-neutral-950-400 dark:to-black">
      <ToastContainer
        position="top-center"
        autoClose={1000}
        hideProgressBar={true}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        transition={Zoom}
        draggable
        pauseOnHover
        theme="dark"
      />

      <Sidebar />
      <MenuButton />
      <section className="flex flex-col h-screen overflow-auto flex-1 scroll-default scroll-smooth">
        {children}
      </section>
    </section>
  );
}
