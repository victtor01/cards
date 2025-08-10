"use client";

import { api } from "@/api";
import { fontFiraCode, fontSaira } from "@/fonts";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { IoMdAlert } from "react-icons/io";
import { toast } from "react-toastify";
import { z } from "zod";

const signUpSchema = z.object({
  firstName: z
    .string()
    .min(3, { message: "O nome precisa ter no mínimo 3 caracteres!" })
    .transform((dt) => dt.toLowerCase()),
  lastName: z
    .string()
    .min(3, { message: "O sobrenome precisa ter no mínimo 3 caracteres!" })
    .transform((dt) => dt.toLowerCase()),
  email: z.string().email({ message: "O formato do email é inválido!" }),
  password: z
    .string({ message: "A senha é obrigatória!" })
    .min(6, { message: "A senha precisa ter no mínimo 6 caracteres!" }),
});

type SignUpSchema = z.infer<typeof signUpSchema>;

export default function SignInPage() {
  const router = useRouter();

  const form = useForm<SignUpSchema>({
    resolver: zodResolver(signUpSchema),
  });

  const onSubmit = useMutation({
    mutationFn: async (data: SignUpSchema) => {
      return await api.post("/users", data);
    },

    onSuccess: async () => {
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    },
  });

  const { register, handleSubmit, formState } = form;
  const { errors } = formState;

  const getErrorMessage = () => {
    if (!onSubmit.isError || !onSubmit.error) {
      return null;
    }
    const error: any = onSubmit.error;

    if (error.response && error.response.data && error.response.data.message) {
      return error.response.data.message;
    }

    return error.message;
  };

  return (
    <form
      onSubmit={handleSubmit((data) => onSubmit.mutateAsync(data))}
      className="bg-more-gradients flex flex-col flex-1 relative gap-2 bg-zinc-50 dark:bg-stone-950 overflow-auto overflow-x-hidden"
    >
      <div className="fixed inset-0 h-full w-full pointer-events-none opacity-20 bg-transparent bg-[linear-gradient(to_right,rgb(99_102_241/0.1)_0.2vh,transparent_2px),linear-gradient(to_bottom,rgb(99_102_241/0.1)_0.2vh,transparent_1px)] bg-[size:5vh_5vh] [mask-image:radial-gradient(ellipse_at_center,white_30%,transparent_100%),linear-gradient(to_bottom,white_30%,transparent_80%)]"></div>

      <header className={`${fontFiraCode} mt-[4vh] mx-auto z-10`}>
        <h2 className="text-3xl font-semibold text-indigo-50 dark:text-indigo-100">
          Sign Up
        </h2>
      </header>

      {onSubmit.isError && (
        <div className="flex items-center gap-4 text-lg font-semibold mt-5 bg-indigo-900/90 text-indigo-100 mx-auto w-full max-w-[30rem] p-5 rounded-2xl border border-indigo-500">
          <IoMdAlert />
          <span>{getErrorMessage()}</span>
        </div>
      )}

      {onSubmit.isSuccess && (
        <div className="flex mt-5 bg-indigo-700/70 text-indigo-50 mx-auto w-full max-w-[30rem] p-5 rounded-2xl border border-indigo-400">
          Registro completado com sucesso!
        </div>
      )}

      <section className="flex mt-10 mx-auto text-md p-10 flex-col gap-4 w-full z-10 max-w-[30rem] border-zinc-100 dark:border-zinc-800 bg-white shadow-xl shadow-indigo-800/70 dark:bg-stone-900 rounded-3xl border dark:shadow-lg dark:shadow-black">
        <label htmlFor="firstName" className="flex flex-col gap-2">
          <span
            className={`${fontSaira} font-semibold text-gray-400 dark:text-gray-100`}
          >
            Your first name
          </span>
          <input
            id="firstName"
            {...register("firstName")}
            type="text"
            className="dark:bg-stone-800 rounded-lg border border-zinc-100 dark:border-zinc-800 p-3 outline-none hover:dark:border-zinc-700 dark:focus:border-zinc-700"
            placeholder="Jonh"
          />
          {errors.firstName && (
            <span className="text-sm text-red-500 mt-1">
              {errors.firstName.message}
            </span>
          )}
        </label>
        <label htmlFor="lastName" className="flex flex-col gap-2">
          <span
            className={`${fontSaira} font-semibold text-gray-400 dark:text-gray-100`}
          >
            Your last name
          </span>
          <input
            id="lastName"
            {...register("lastName")}
            type="text"
            className="dark:bg-stone-800 rounded-lg border border-zinc-100 dark:border-zinc-800 p-3 outline-none hover:dark:border-zinc-700 dark:focus:border-zinc-700"
            placeholder="Doe"
          />
          {errors.lastName && (
            <span className="text-sm text-red-500 mt-1">
              {errors.lastName.message}
            </span>
          )}
        </label>
        <label htmlFor="email" className="flex flex-col gap-2">
          <span
            className={`${fontSaira} font-semibold text-gray-400 dark:text-gray-100`}
          >
            Email
          </span>
          <input
            id="email"
            type="email"
            {...register("email")}
            className="dark:bg-stone-800 rounded-lg border border-zinc-100 dark:border-zinc-800 p-3 outline-none hover:dark:border-zinc-700 dark:focus:border-zinc-700"
            placeholder="JonhDoe@example.com"
          />
          {errors.email && (
            <span className="text-sm text-red-500 mt-1">
              {errors.email.message}
            </span>
          )}
        </label>
        <label htmlFor="password" className="flex flex-col gap-2">
          <span
            className={`${fontSaira} font-semibold text-gray-400 dark:text-gray-100`}
          >
            Password
          </span>
          <input
            id="password"
            type="password"
            {...register("password")}
            className="dark:bg-stone-800 rounded-lg border border-zinc-100 dark:border-zinc-800 p-3 outline-none hover:dark:border-zinc-700 dark:focus:border-zinc-700"
            placeholder="JonhDoe123"
          />
          {errors.password && (
            <span className="text-sm text-red-500 mt-1">
              {errors.password.message}
            </span>
          )}
        </label>
        <footer className="flex flex-1 mt-5">
          <button
            type="submit"
            className="bg-indigo-600 border-t border-l border-indigo-400 rounded-lg p-3 px-5 flex-1 transition-all shadow-md shadow-indigo-500/10 hover:shadow-lg hover:shadow-indigo-500/30 opacity-80 hover:opacity-100"
          >
            <span className={`${fontSaira} font-semibold text-lg text-white`}>
              SignIn
            </span>
          </button>
        </footer>
      </section>

      <section className="flex mx-auto w-full max-w-[30rem]">
        <Link
          href="/login"
          className="flex-1 my-5 w-full grid place-items-center text-xl text-indigo-50 font-semibold hover:text-white dark:hover:text-white"
        >
          <span className={fontSaira}>Eu já tenho conta</span>
        </Link>
      </section>
    </form>
  );
}
