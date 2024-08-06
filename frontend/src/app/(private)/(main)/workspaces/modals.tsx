"use client";

import { CreateWorkspace } from "@/components/modals-workspaces/create-workspace";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { BiPlus } from "react-icons/bi";

type Modal = "create" | null;

export function ButtonWithModals() {
  const params = useSearchParams();
  const modal: Modal = (params.get("md") as Modal) || null;

  return (
    <>
      {modal === "create" && <CreateWorkspace />}

      <Link
        href={"?md=create"}
        className="bg-zinc-800 bg-opacity-60 rounded p-1 flex items-center gap-2 px-2 capitalize border border-zinc-800 opacity-90 hover:opacity-100"
      >
        <BiPlus />
        <span>create</span>
      </Link>
    </>
  );
}
