import { useRouter } from "next/navigation"

export function useSidebar() {
  const router = useRouter();

  const redirectTo = (link: string) => router.push(link);
  
  return {
    redirectTo
  }
}