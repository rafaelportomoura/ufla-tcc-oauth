/* eslint-disable no-empty-function */
import { ZodType, z } from 'zod';
import { ValidationError } from '../exceptions/ValidationError';

export class Validator<T> {
  constructor(private schema: ZodType<T>) {}

  async validate(value_to_check: unknown): Promise<z.infer<ZodType<T>>> {
    const result = await this.schema.safeParseAsync(value_to_check);

    if (result.success) return result.data;

    throw new ValidationError(result.error.format());
  }
}
