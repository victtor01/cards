import { UsersRepository } from '@infra/repositories/users.repository';
import { Multer } from 'multer';

abstract class CleanServiceInterface {
  abstract cleanImagesOfUsers(): Promise<boolean>;
  abstract cleanImagesOfWorkspaces(): Promise<boolean>;
}

export class CleanService implements CleanServiceInterface {
  constructor(private readonly usersRepo: UsersRepository, private readonly multer: Multer) {}

  public async cleanImagesOfWorkspaces(): Promise<boolean> {
    throw new Error('Method not implemented.');
  }

  public async cleanImagesOfUsers(): Promise<boolean> {
			throw new Error('Method not implemented.');
  }
}
