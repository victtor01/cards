import { BadRequestException } from './errors';

export function ThrowErrorInValidationSchema(error: any): any {
  const errors = error?.errors || 'errors';
  const messageErrors = errors?.map((err: any) => err.message) || 'errros';
  throw new BadRequestException(JSON.stringify(messageErrors));
}
