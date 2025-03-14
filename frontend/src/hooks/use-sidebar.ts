import { api } from "@/api";
import { GenerateSoundClick } from "@/utils/generate-sound-click";
import { useQuery } from "@tanstack/react-query";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

type Card = {
  id: string;
  title: string;
};

export type Workspace = {
  id: string;
  name: string;
  code: string;
  workspaces: Workspace[];
  cards: Card[];
};

export function useSidebar() {
  const router = useRouter();
  const pathName = usePathname();

  const [trashOpen, setTrashOpen] = useState<boolean>(false);
  const handleTrashOpen = () => setTrashOpen((prev) => !prev);

  const redirectTo = (link: string) => {
    GenerateSoundClick();
    router.push(link);
  };

  const { data: workspaces } = useQuery<Workspace[]>({
    queryKey: ["workspaces"],
    queryFn: async () => {
      return (await api.get("/workspaces/find/tree")).data;
    },
  });

  const { data: i } = useQuery({
    queryKey: ["i"],
    queryFn: async () => {
      return (await api.get("/users/mine")).data;
    },
  });

  return {
    redirectTo,
    pathName,
    trashOpen,
    handleTrashOpen,
    workspaces,
    i,
  };
}

export const useResize = () => {
  const min = 280;
  const max = 600;

  const [size, setSize] = useState({ x: min });
  const [resizing, setResizing] = useState<boolean>(false);

  const handler = (mouseDownEvent: any) => {
    const startSize = size;
    const startPosition = { x: mouseDownEvent.pageX, y: mouseDownEvent.pageY };

    function onMouseMove(mouseMoveEvent: any) {
      setResizing(true);
      setSize(() => {
        const newWidth = startSize.x - startPosition.x + mouseMoveEvent.pageX;
        const clampedWidth = Math.max(min, Math.min(max, newWidth));

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
