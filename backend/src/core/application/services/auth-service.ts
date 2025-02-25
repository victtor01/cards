import { Session } from '@infra/config/constants/session';
import { BadRequestException, NotFoundException, UnauthorizedException } from '@src/utils/errors';
import { compare } from 'bcryptjs';
import { AuthUserDto } from '../dtos/auth-user-dto';
import { AuthServiceInterface } from '../interfaces/auth-service-interface';
import { JwtServiceInterface } from '../interfaces/jwt-service-interface';
import { UsersServiceInterface } from '../interfaces/users-service-interface';

type AuthResponse = {
  accessToken: string;
  refreshToken: string;
};

export class AuthService implements AuthServiceInterface {
  constructor(
    private readonly usersService: UsersServiceInterface,
    private readonly jwtService: JwtServiceInterface
  ) {}

  public async generateJWT(payload: Session, expiresIn: string) {
    return await this.jwtService.signJWT({ payload, expiresIn });
  }

  public async auth({ email, password }: AuthUserDto): Promise<AuthResponse> {
    const user = await this.usersService.findOneByEmail(email);

    if (!user?.id) {
      throw new NotFoundException('usuário não encontrado!');
    }

    const passwordsCompare = await compare(password, user.password);

    if (!passwordsCompare) {
      throw new UnauthorizedException('as senhas não coecidem!');
    }

    try {
      const accessToken = await this.generateJWT({ id: user.id }, '10m');
      const refreshToken = await this.generateJWT({ id: user.id }, '1d');

      return {
        accessToken,
        refreshToken,
      };
    } catch (error) {
      throw new BadRequestException('There was an error when trying to log in!');
    }
  }
}
