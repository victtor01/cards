import { cookies } from "next/headers";

type Props = {
  url: string;
};

const getCookie = async (name: string) => {
  return cookies().get(name)?.value ?? "";
};

export async function useFetch({ url }: Props) {
  const accessToken = await getCookie("__access_token");
  const refreshToken = await getCookie("__refresh_token");

  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/${url}`, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      Cookie: `__access_token=${accessToken};__refresh_token=${refreshToken}`,
    },
  });

  const parse = await res.json();

  return parse;
}
