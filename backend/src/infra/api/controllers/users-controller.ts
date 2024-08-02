import { CreateUserDto } from "@core/application/dtos/create-user-dto";
import { UsersServiceInterface } from "@core/application/interfaces/users-service-interface";
import { BadRequestException } from "@src/utils/errors";
import { Request, Response } from "express";

class UsersController {
  constructor(private readonly usersService: UsersServiceInterface) {}

  public async uploadPhoto (request: Request, response: Response) {
    const { id: userId } = request.session;
    const { file } = request;

    const { filename } = file;

    const uploaded = await this.usersService.updatePhoto({ userId, filename })

    return response.status(200).json({
      error: false,
      message: 'photo updated'
    })

    throw new BadRequestException("error when trying to update user photo");
  }

  public async create(request: Request, response: Response) {
    const { body } = request;
    const { firstName, lastName, email, password }: CreateUserDto = body;

    await this.usersService.save({
      firstName,
      lastName,
      email,
      password,
    });

    return response.status(200).json({
      created: true,
    });
  }

  public async mine(request: Request, response: Response) {
    return response.json({ 
      error: false
    })
  }
}

export { UsersController };

