import { JwtService } from '@core/application/services/jwt-service';
import { UnauthorizedException } from '@src/utils/errors';
import { NextFunction, Request, Response } from 'express';

export async function sessionMiddleware(req: Request, res: Response, next: NextFunction) {
  const jwtService = new JwtService();
  const { payload } = await jwtService.getSession(req, res);

  if (!payload?.id) {
    throw new UnauthorizedException('unauthorized user!');
  }

  const session = { id: payload.id };
  req.session = session;

  next();
}
