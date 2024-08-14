import { api } from "@/api";
import { GenerateSoundClick } from "@/utils/generate-sound-click";
import { useQuery } from "@tanstack/react-query";
import { usePathname, useRouter } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";
import { queryClient } from "../providers/query-client";

type Card = {
  id: string;
  title: string;
}

export type Workspace = {
  id: string;
  name: string;
  code: string;
  workspaces: Workspace[];
  cards: Card[]
};

export function useSidebar() {
  const router = useRouter();
  const pathName = usePathname();

  const redirectTo = (link: string) => {
    GenerateSoundClick();
    router.push(link);
  };

  const { data: workspaces } = useQuery<Workspace[]>({
    queryKey: ["workspaces"],
    queryFn: async () => {
      return (await api.get("/workspaces/tree")).data;
    },
  });

  const { data: i } = useQuery({
    queryKey: ["i"],
    queryFn: async () => {
      return (await api.get("/users/mine")).data;
    },
  });

  const createFolder = async (parentId: string | null = null) => {
    const res = await api.post("/workspaces", { name: "new folder", parentId });

    console.log(res);

    await queryClient.invalidateQueries({
      queryKey: ["workspaces"],
    });
  };

  return {
    redirectTo,
    createFolder,
    pathName,
    workspaces,
    i,
  };
}

export const useResize = () => {
  const [size, setSize] = useState({ x: 300 });
  const [resizing, setResizing] = useState<boolean>(false);

  const handler = (mouseDownEvent: any) => {
    const startSize = size;
    const startPosition = { x: mouseDownEvent.pageX, y: mouseDownEvent.pageY };

    function onMouseMove(mouseMoveEvent: any) {
      setResizing(true);
      setSize(() => {
        const newWidth = startSize.x - startPosition.x + mouseMoveEvent.pageX;
        const clampedWidth = Math.max(300, Math.min(600, newWidth));

        return {
          x: clampedWidth,
        };
      });
    }

    function onMouseUp() {
      setResizing(false);
      document.body.removeEventListener("mousemove", onMouseMove);
    }

    document.body.addEventListener("mousemove", onMouseMove);
    document.body.addEventListener("mouseup", onMouseUp, { once: true });
  };

  return { size, handler, resizing };
};