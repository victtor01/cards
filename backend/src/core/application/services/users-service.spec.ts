import { User } from '@core/domain/entities/user.entity';
import { beforeEach, describe, expect, it, Mock, vi } from 'vitest';
import { UsersRepository } from '../../../infra/repositories/users.repository';
import { CreateUserDto } from '../dtos/users-dtos/create-user-dto';
import { PropsToUpdataPhoto } from '../dtos/users-dtos/update-photo-user.dto';
import { createUserSchema } from '../validations/users-schemas/create-user-schema';
import { UsersService } from './users-service';

vi.mock('../validations/users-schemas/create-user-schema', () => ({
  createUserSchema: {
    parseAsync: vi.fn(),
  },
}));

vi.mock("@src/utils/unlink")

describe('usersService', () => {
  let usersService: UsersService;

  const dataToCreateNewUser = {
    firstName: 'Jonh',
    lastName: 'Mark',
    email: 'jonh@gmail.com',
    password: 'jonh123',
  } satisfies CreateUserDto;

  const userMock = new User(dataToCreateNewUser);

  const usersRepo = {
    save: vi.fn(),
    findOneByEmail: vi.fn(),
    findOneById: vi.fn(),
  } satisfies UsersRepository;

  beforeEach(() => {
    usersService = new UsersService(usersRepo, null);
  });

  it('should create a new user', async () => {
    (createUserSchema.parseAsync as Mock).mockResolvedValue(Promise.resolve(userMock));
    
    usersRepo.findOneByEmail.mockReturnValueOnce(Promise.resolve(null));
    usersRepo.save.mockReturnValueOnce(userMock);

    const action = await usersService.save(dataToCreateNewUser);

    expect(usersRepo.findOneByEmail).toBeCalledTimes(1);
    expect(action).toBeInstanceOf(User);
    expect(action).instanceOf(User);
    expect(action.firstName).toBe('Jonh');
  });

  it('should throw unauthorized error', async () => {
    vi.spyOn(usersService, 'findOneByEmail').mockReturnValueOnce(Promise.resolve(userMock));

    expect(usersService.save(dataToCreateNewUser)).rejects.toThrowError();
  });

  describe('#updatePhoto', () => {
    it('should error photo because user does not exist!', async () => {
      const updatePhoto = {
        userId: 'USER_DONT_EXIST',
        filename: 'FILENAME',
      } satisfies PropsToUpdataPhoto;

      usersRepo.findOneByEmail.mockRejectedValueOnce(null);

      const action = usersService.updatePhoto(updatePhoto);

      expect(action).rejects.toThrow();
    });
  });
});
