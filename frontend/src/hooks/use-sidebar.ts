import { api } from "@/api";
import { GenerateSoundClick } from "@/utils/generate-sound-click";
import { useQuery } from "@tanstack/react-query";
import { usePathname, useRouter } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";

export type Workspace = {
  name: string;
  code: string;
  workspaces: Workspace[];
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

  return {
    redirectTo,
    pathName,
    workspaces,
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
      setSize(() => ({
        x: startSize.x - startPosition.x + mouseMoveEvent.pageX,
      }));
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


// export const useResize = () => {
//   const elementRef = React.useRef<HTMLDivElement | null>(null);

//   const handleMouseDown = (e: React.MouseEvent) => {
//     const ele = elementRef.current;
//     if (!ele) {
//       return;
//     }

//     const startPos = { x: e.clientX };
//     const styles = window.getComputedStyle(ele);
//     const w = parseInt(styles.width, 10);

//     const handleMouseMove = (e: MouseEvent) => {
//       const dx = e.clientX - startPos.x;
//       ele.style.width = `${w + dx}px`;
//       updateCursor();
//     };

//     const handleMouseUp = () => {
//       document.removeEventListener("mousemove", handleMouseMove);
//       document.removeEventListener("mouseup", handleMouseUp);
//       resetCursor();
//     };

//     document.addEventListener("mousemove", handleMouseMove);
//     document.addEventListener("mouseup", handleMouseUp);
//   };

//   const handleTouchStart = (e: React.TouchEvent) => {
//     const ele = elementRef.current;
//     if (!ele) return;

//     const touch = e.touches[0];
//     const startPos = { x: touch.clientX };
//     const styles = window.getComputedStyle(ele);
//     const w = parseInt(styles.width, 10);

//     const handleTouchMove = (e: TouchEvent) => {
//       const touch = e.touches[0];
//       const dx = touch.clientX - startPos.x;
//       ele.style.width = `${w + dx}px`;
//       updateCursor();
//     };

//     const handleTouchEnd = () => {
//       document.removeEventListener("touchmove", handleTouchMove);
//       document.removeEventListener("touchend", handleTouchEnd);
//       resetCursor();
//     };

//     document.addEventListener("touchmove", handleTouchMove);
//     document.addEventListener("touchend", handleTouchEnd);
//   };

//   const updateCursor = () => {
//     document.body.style.cursor = "col-resize";
//     document.body.style.userSelect = "none";
//   };

//   const resetCursor = () => {
//     document.body.style.removeProperty("cursor");
//     document.body.style.removeProperty("user-select");
//   };

//   return {
//     elementRef,
//     handleMouseDown,
//     handleTouchStart,
//   };
// };
