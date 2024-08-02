import { User } from "@core/domain/entities/user.entity";

export abstract class UsersRepository {
  abstract save(user: User): Promise<User>
  abstract findOneById(userId: string): Promise<User>
  abstract findOneByEmail(email: string): Promise<User>
}