export class ErrorInstance extends Error {
  public readonly statusCode: number;
  public error: string;

  constructor(message: string, statusCode: number = 500) {
    super(message);
    this.error = "Internal server error";
    this.statusCode = statusCode;
  }
}

export class BadRequestException extends ErrorInstance {
  constructor(message: string) {
    super(message, 401);
    this.error = "Bad Request";
  }
}

export class NotFoundException extends ErrorInstance {
  constructor(message: string) {
    super(message, 404);
    this.error = "Not Found";
  }
}

export class UnauthorizedException extends ErrorInstance {
  constructor(message: string) {
    super(message, 401);
    this.error = "Unauthorized";
  }
}
