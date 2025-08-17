"use client";

import { AnimatePresence } from "framer-motion";
import { ReadonlyURLSearchParams, useRouter, useSearchParams } from "next/navigation";
import React, { Suspense } from "react";

const KEY_MODAL = "modal";

type ModalLayoutProps<T extends string> = {
  children: React.ReactNode;
  modals: Record<T, React.ComponentType<{ params: ReadonlyURLSearchParams }>>;
};

export const useModalAction = (modal: string) => {
  const router = useRouter();
  
  return () => {
    router.push(`?${KEY_MODAL}=${modal}`)
  }
}

export function ModalLayout<T extends string>({
  children,
  modals,
}: ModalLayoutProps<T>) {
  const params = useSearchParams();
  const modalType = params.get(KEY_MODAL) as T | null;

  const ModalComponent =
    modalType && modals.hasOwnProperty(modalType) ? modals[modalType] : null;

  return (
    <AnimatePresence>
      {ModalComponent && (
        <div key={modalType}>
          {React.createElement(
            ModalComponent as React.ComponentType<{ params: URLSearchParams }>,
            {
              params: new URLSearchParams(params.toString()),
            }
          )}
        </div>
      )}
      <Suspense
        fallback={
          <div className="flex w-full flex-col gap-2">
            <div className="p-4 bg-zinc-100 rounded-lg animate-pulse"></div>
            <div className="h-[10rem] bg-zinc-100 rounded-lg animate-pulse w-full"></div>
          </div>
        }
      >
        {children}
      </Suspense>
    </AnimatePresence>
  );
}
