import { JwtConfig, secret } from '@infra/config/constants/jwt';
import { Session } from '@infra/config/constants/session';
import { BadRequestException, UnauthorizedException } from '@src/utils/errors';
import { CookieOptions, Request, Response } from 'express';
import { jwtVerify, JWTVerifyResult, SignJWT } from 'jose';
import { JwtServiceInterface } from '../interfaces/jwt-service-interface';

const cookiesConfig = {
  accessToken: '__access_token',
  refreshToken: '__refresh_token',
};

export class JwtService implements JwtServiceInterface {
  
  private verifyJWT = async (token: string) => await jwtVerify<Session>(token, secret);
  private configCookie = { httpOnly: true, secure: false } satisfies CookieOptions;

  public async signJWT({ payload, expiresIn }: { payload: any; expiresIn: string }) {
    return await new SignJWT(payload)
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime(expiresIn)
      .sign(secret);
  }

  public async renewTokenWithPassportOrThrowError(refreshToken: string): Promise<string> {
    try {
      const { payload } = await this.verifyJWT(refreshToken);

      const newAccessToken = await this.signJWT({
        payload: { id: payload.id },
        expiresIn: new JwtConfig().getAccessTokenExpiration(),
      });

      return newAccessToken;
    } catch (error) {
      throw new BadRequestException('session expired!');
    }
  }

  public async getSession(request: Request, response: Response): Promise<JWTVerifyResult<Session>> {
    const { cookies } = request;

    if (!cookies?.[cookiesConfig.accessToken] || !cookies?.[cookiesConfig.refreshToken]) {
      throw new UnauthorizedException('unauthorized session!');
    }

    const { __access_token, __refresh_token } = cookies;

    const session = await this.verifyJWT(__access_token)
      .catch(async () => {
        const newToken = await this.renewTokenWithPassportOrThrowError(__refresh_token);
        response.cookie(cookiesConfig.accessToken, newToken, this.configCookie);

        const payload = await this.verifyJWT(newToken);

        return payload;
      })
      .catch((err) => {
        throw new UnauthorizedException(err.message);
      });

    return session;
  }
}
