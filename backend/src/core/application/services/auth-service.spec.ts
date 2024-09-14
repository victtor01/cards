import { User } from '@core/domain/entities/user.entity';
import { UsersRepository } from '@infra/repositories/users.repository';
import { NotFoundException } from '@src/utils/errors';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AuthServiceInterface } from '../interfaces/auth-service-interface';
import { JwtServiceInterface } from '../interfaces/jwt-service-interface';
import { UsersServiceInterface } from '../interfaces/users-interfaces/users-service-interface';
import { AuthService } from './auth-service';
import { UsersService } from './users-service';

const usersRepositoryMock = {
  save: vi.fn(),
  findOneByEmail: vi.fn(),
  findOneById: vi.fn(),
} satisfies UsersRepository;

const jwtServiceMock = {
  signJWT: vi.fn(),
  renewTokenWithPassportOrThrowError: vi.fn(),
  getSession: vi.fn(),
} satisfies JwtServiceInterface;

const userMock = new User({
  lastName: 'example',
  firstName: 'example',
  email: 'example',
  password: 'example',
});

describe('usersService', () => {
  let authService: AuthServiceInterface;
  let usersService: UsersServiceInterface;

  beforeEach(() => {
    usersService = new UsersService(usersRepositoryMock, null);
    authService = new AuthService(usersService, jwtServiceMock);
  });

  it('should throw unauthorized', async () => {
    vi.spyOn(usersService, 'findOneByEmail').mockReturnValueOnce(Promise.resolve(null));

    const response = authService.auth({
      email: 'example@gmail.com',
      password: 'example',
    });

    await expect(response).rejects.toThrowError(NotFoundException);
  });

  it('should auth user', async () => {
    vi.spyOn(usersService, 'findOneByEmail').mockReturnValueOnce(Promise.resolve(null));
  });
});
