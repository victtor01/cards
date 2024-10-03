import "react-toastify/dist/ReactToastify.css";
import { Sidebar } from "@/components/sidebar/main-sidebar";
import { ToastContainer } from "react-toastify";

type LayoutMainProps = {
  children: React.ReactNode;
};

export default function LayoutMain({ children }: LayoutMainProps) {
  return (
    <section className="flex w-full h-screen bg-white dark:bg-neutral-950">
      <ToastContainer
        position="top-right"
        autoClose={1000}
        hideProgressBar={true}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />

      <Sidebar />

      <section className="flex flex-col h-screen overflow-auto flex-1 scroll-default scroll-smooth">
        {children}
      </section>
    </section>
  );
}
