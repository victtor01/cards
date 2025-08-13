import { AuthServiceInterface } from '@core/application/interfaces/auth-service-interface';
import { CookieOptions, Request, Response } from 'express';

export class AuthController {
  constructor(private readonly authService: AuthServiceInterface) {}

  public async auth(request: Request, response: Response) {
    const { body } = request;
    const { email, password } = body;

    const auth = await this.authService.auth({
      email,
      password,
    });

    const configCookie = {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      partitioned: true,
    } satisfies CookieOptions;

    response.cookie('__access_token', auth.accessToken, configCookie);
    response.cookie('__refresh_token', auth.refreshToken, configCookie);

    return response.json(auth);
  }
}
