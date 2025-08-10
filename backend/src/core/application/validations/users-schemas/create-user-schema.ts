import { z } from "zod";

export const createUserSchema = z.object({
  firstName: z
    .string()
    .min(3, { message: "fistnamed field requires a minimum of 3 characters!" })
    .transform((dt) => dt.toLowerCase()),
  lastName: z
    .string()
    .min(3, { message: "lastname field requires a minimum of 6 characters!" })
    .transform((dt) => dt.toLowerCase()),
  email: z.string().email({ message: "the email format is invalid!" }),
  password: z.string({ message: "password is required!" }).min(6, { message: "password length is minimal 6!" }),
});
