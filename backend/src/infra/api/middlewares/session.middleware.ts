import { JwtService } from '@core/application/services/jwt-service';
import { NextFunction, Request, Response } from 'express';

export async function sessionMiddleware(req: Request, res: Response, next: NextFunction) {
  const jwtService = new JwtService();
  const session = await jwtService.getSession(req, res);
  const payload = { id: session.id };
  req.session = payload;

  next();
}
