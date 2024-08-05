import { AuthUserDto } from "../dtos/auth-user-dto";

export abstract class AuthServiceInterface {
  abstract auth({ email, password }: AuthUserDto): Promise<any>;
}
