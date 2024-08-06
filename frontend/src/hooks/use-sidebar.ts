import { api } from "@/api";
import { GenerateSoundClick } from "@/utils/generate-sound-click";
import { useQuery } from "@tanstack/react-query";
import { usePathname, useRouter } from "next/navigation";

type Workspace = {
  name: string;
  code: string;
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
      return (await api.get("/workspaces")).data;
    },
  });

  return {
    redirectTo,
    pathName,
    workspaces,
  };
}
