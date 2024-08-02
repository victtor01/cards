import z from "zod";

const AuthUserSchema = z.object({
  password: z.string().min(1, "password field is required"),
  email: z
    .string()
    .email("the email format is invalid")
    .min(1, "email field is required"),
});

export { AuthUserSchema };

