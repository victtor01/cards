
export const secret = new TextEncoder().encode('your-secret-key');

export class JwtConfig {
  private readonly secretKey: string = 'EXAMPLE_KEY';
  private readonly accessTokenExpiration: string = '12s';
  private readonly refreshTokenExpiration: string = '1d';

  getSecretKey = (): string => this.secretKey;
  getAccessTokenExpiration = (): string => this.accessTokenExpiration;
  getRefreshTokenExpiration = (): string => this.refreshTokenExpiration;
}
