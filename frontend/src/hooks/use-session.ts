import { NEXT_SECRET_KEY } from "@/config/constants";
import * as jose from "jose";
import { cookies } from "next/headers";

const useSession = () => {
  const getCookieRefreshToken = () =>
    cookies().get("__refresh_token")?.value || null;

  const getSecureSessionNext = () =>
    cookies().get("_secure-next-auth")?.value || null;

  const createSecretCompositionJwt = (): string => {
    const refresh = getCookieRefreshToken();

    const composition: string = `${NEXT_SECRET_KEY}${refresh}`;
    return composition;
  };

  const openSessionToken = async (token: string): Promise<jose.JWTPayload> => {
    const composition = createSecretCompositionJwt();
    const secret = new TextEncoder().encode(composition);

    try {
      const { payload } = await jose.jwtVerify(token, secret);
      return payload;
    } catch (error: any) {
      return { exp: null } as unknown as jose.JWTPayload;
    }
  };

  const isSessionValid = async (): Promise<boolean> => {
    // Get cookies
    const sessionCookie = getSecureSessionNext();
    const refresh_token = getCookieRefreshToken();

    if (!sessionCookie || !refresh_token) return false;

    const session = await openSessionToken(sessionCookie);

    if (!session?.email || !session?.exp) return false;

    const currentDate = new Date().getTime();

    return (session.exp as number) * 1000 > currentDate;
  };

  const getAuthorization = async (): Promise<any> => {
    // Get cookie
    const cookie = getSecureSessionNext();
    // Verify cookie
    if (!cookie) return;
    // ParseJSon cookie
    const user = await openSessionToken(cookie);
    return { user };
  };

  return {
    getAuthorization,
    getCookieRefreshToken,
    getSecureSessionNext,
    isSessionValid,
    openSessionToken,
  };
};

export { useSession };

