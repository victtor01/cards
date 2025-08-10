import React from "react";
import { Slide, ToastContainer, Zoom } from "react-toastify";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ToastContainer
        position="top-center"
        autoClose={1000}
        hideProgressBar={true}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        transition={Slide}
        draggable
        pauseOnHover
        theme="dark"
      />

      {children}
    </>
  );
}
