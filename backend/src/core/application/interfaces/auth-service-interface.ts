import { AuthUserDto } from "../dtos/auth-user-dto";
import { AuthUserSchema } from "../validations/auth-user-schema";

export abstract class AuthServiceInterface {
  abstract auth({ email, password }: AuthUserDto): Promise<any>;
}
