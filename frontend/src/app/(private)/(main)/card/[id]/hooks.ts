import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const schemaCreateCard = z.object({
  name: z.string(),
  content: z.string(),
})

type CreateCardProps = z.infer<typeof schemaCreateCard>

export function useCreateCard () {
  const form = useForm<CreateCardProps>({
    resolver: zodResolver(schemaCreateCard),
  });

  return {
    form
  }
}