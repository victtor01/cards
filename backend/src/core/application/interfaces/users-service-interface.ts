import { User } from '@core/domain/entities/user.entity';
import { CreateUserDto } from '../dtos/create-user-dto';
import { PropsToUpdataPhoto } from '../dtos/update-photo-user.dto';

export abstract class UsersServiceInterface {
  abstract save(data: CreateUserDto): Promise<User>;
  abstract findOneByEmail(email: string): Promise<User | null>;
  abstract findOneById(userId: string): Promise<User>
  abstract updatePhoto({ userId, filename }: PropsToUpdataPhoto): Promise<any>;
}
