import { api } from "@/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email().min(1),
  password: z.string().min(1),
});

type LoginInterface = z.infer<typeof loginSchema>;

export function useLogin() {
  const router = useRouter();

  const form = useForm<LoginInterface>({
    resolver: zodResolver(loginSchema),
  });

  const auth = async ({ email, password }: LoginInterface) => {
    try {
      const res = await api.post("/auth", { email, password });

      if (res.data.error) {
        throw new Error("credentials incorrect!");
      }

      router.push("/home");
    } catch (error) {
      alert("erro");
    }
  };

  return {
    auth,
    form,
  };
}
