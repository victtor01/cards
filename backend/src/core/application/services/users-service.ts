import { User } from '@core/domain/entities/user.entity';
import { UsersRepository } from '@infra/repositories/users.repository';
import { BadRequestException, UnauthorizedException } from '@src/utils/errors';
import { ThrowErrorInValidationSchema } from '@src/utils/throw-error-validation-schema';
import { unlinkUploadFile } from '@src/utils/unlink';
import { hash } from 'bcryptjs';
import { Multer } from 'multer';
import { CreateUserDto } from '../dtos/users-dtos/create-user-dto';
import { PropsToUpdataPhoto } from '../dtos/users-dtos/update-photo-user.dto';
import { UsersServiceInterface } from '../interfaces/users-interfaces/users-service-interface';
import { createUserSchema } from '../validations/users-schemas/create-user-schema';

export class UsersService implements UsersServiceInterface {
  constructor(private readonly usersRepo: UsersRepository, private readonly multer: Multer) {}

  public async findOneByEmail(email: string): Promise<User | null> {
    const user = await this.usersRepo.findOneByEmail(email);

    return user;
  }

  public async findOneById(userId: string): Promise<User> {
    const user = await this.usersRepo.findOneById(userId);

    return user;
  }

  public async updatePhoto({ userId, filename }: PropsToUpdataPhoto): Promise<any> {
    const user = await this.findOneById(userId);
    if (!user?.id) {
      await unlinkUploadFile(filename);
      throw new BadRequestException('user(s) not exists!');
    }

    try {
      user.photo = filename;
      const saved = await this.usersRepo.save(user);

      return saved;
    } catch (error) {
      throw new BadRequestException('error when trying to update user!');
    }
  }

  public async save({ firstName, lastName, email, password }: CreateUserDto): Promise<User> {
    const userAlreadyExists = await this.findOneByEmail(email);

    const parse = await createUserSchema
      .parseAsync({
        firstName,
        lastName,
        email,
        password,
      })
      .catch((err) => ThrowErrorInValidationSchema(err));

    if (userAlreadyExists?.email) throw new UnauthorizedException('user already exists!');

    const user = new User({
      firstName: parse.firstName!,
      lastName: parse.lastName!,
      email: parse.email!,
      password: parse.password!,
    });

    try {
      user.password = await hash(user.password, 10);
      const created = await this.usersRepo.save(user);

      return created;
    } catch (error) {
      throw new BadRequestException('There was an error trying to create a new user!');
    }
  }
}
