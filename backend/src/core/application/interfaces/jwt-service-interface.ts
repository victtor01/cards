import { Request, Response } from 'express';

export abstract class JwtServiceInterface {
  abstract signJWT({ payload, expiresIn }): Promise<string>;
  abstract renewTokenWithPassportOrThrowError(refreshToken: string): Promise<string>;
  abstract getSession(req: Request, res: Response): Promise<any>;
}
