import { User } from '@core/domain/entities/user.entity';
import { Repository } from 'typeorm';
import { UsersRepository } from '../users.repository';

export class ImplementsUsersRepository implements UsersRepository {
  constructor(private readonly usersRepo: Repository<User>) {}

  public async save(user: User): Promise<User> {
    return await this.usersRepo.save(user);
  }

  public async findOneByEmail(email: string): Promise<User> {
    return await this.usersRepo.findOneBy({
      email,
    });
  }

  public async findOneById(userId: string): Promise<User> {
    return await this.usersRepo.findOneBy({
      id: userId,
    });
  }
}
