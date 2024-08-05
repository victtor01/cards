import { ZodError } from 'zod';
import { BadRequestException } from './errors';

export function ThrowErrorInValidationSchema(error: any): any {
  const errors = error.errors;
  const messageErrors = errors.map((err: any) => err.message);
  throw new BadRequestException(JSON.stringify(messageErrors));
}
