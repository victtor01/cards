import { api } from "@/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
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

  const auth = useMutation({
    mutationFn: async ({ email, password }: LoginInterface) => {
      return await api.post("/auth", { email, password });
    },  
    
    onSuccess: (data) => {
      console.log("RECEBENDO A DATA", data);
      router.push("/home")
      toast("Login feito");
    },

    onError: () => {
      toast("Credenciais incorretas");
    },
  });

  return {
    auth,
    form,
  };
}
