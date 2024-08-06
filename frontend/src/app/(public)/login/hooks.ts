import { api } from "@/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email().min(1),
  password: z.string().min(1),
});

type LoginInterface = z.infer<typeof loginSchema>;

export function useLogin() {
  const form = useForm<LoginInterface>({
    resolver: zodResolver(loginSchema),
  });

  const auth = async ({ email, password }: LoginInterface) => {
    try {
      const res = await api.post("/auth", { email, password });
      
      console.log(res)
    } catch (error) {
      alert("erro")
    }
  };

  return {
    auth,
    form,
  };
}
