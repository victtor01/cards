import { User } from "@core/domain/entities/user.entity";
import { beforeEach, describe, expect, it, Mock, vi } from "vitest";
import { UsersRepository } from "../../../infra/repositories/users.repository";
import { CreateUserDto } from "../dtos/users-dtos/create-user-dto";
import { createUserSchema } from "../validations/users-schemas/create-user-schema";
import { UsersService } from "./users-service";

vi.mock("../validations/users-schemas/create-user-schema", () => ({
  createUserSchema: {
    parseAsync: vi.fn(),
  },
}));

describe("usersService", () => {
  let usersService: UsersService;
  
  const dataToCreateNewUser = {
    firstName: "Jonh",
    lastName: "Mark",
    email: "jonh@gmail.com",
    password: "jonh123",
  } satisfies CreateUserDto;

  const userMock = new User(dataToCreateNewUser);

  const usersRepo: UsersRepository = {
    save: () => Promise.resolve(userMock),
    findOneByEmail: () => Promise.resolve(userMock),
    findOneById: () => Promise.resolve(userMock),
  }
  
  beforeEach(() => {
    usersService = new UsersService(
      usersRepo,
      null
    );
  });

  it("should create a new user", async () => {
    (createUserSchema.parseAsync as Mock).mockResolvedValue(
      Promise.resolve(userMock)
    );
    
    vi.spyOn(usersService, "findOneByEmail").mockReturnValueOnce(
      Promise.resolve(null)
    );

    const action = await usersService.save(dataToCreateNewUser);

    expect(usersService.findOneByEmail).toBeCalledTimes(1);
    // expect(createUserSchema.parseAsync).toBeCalledTimes(1);
    expect(action).toBeInstanceOf(User);
    expect(action).instanceOf(User);
    expect(action.firstName).toBe("Jonh");
  });

  it("should throw unauthorized error", async () => {
    vi.spyOn(usersService, "findOneByEmail").mockReturnValueOnce(
      Promise.resolve(userMock)
    );

    expect(usersService.save(dataToCreateNewUser)).rejects.toThrowError();
  });
});
