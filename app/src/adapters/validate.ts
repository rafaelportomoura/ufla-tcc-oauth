/* eslint-disable no-empty-function */
import { getClassSchema } from 'joi-class-decorators';
import { Constructor, JoiValidationGroup } from 'joi-class-decorators/internal/defs';
import { CODE_MESSAGES } from '../constants/codeMessages';
import { ValidationError } from '../exceptions/ValidationError';

export class Validator {
  constructor(private validation_object: unknown) {}

  async validateByClass<T>(class_definition: Constructor<T>, group?: JoiValidationGroup): Promise<T> {
    const schema = getClassSchema(class_definition, group ? { group } : undefined);
    const { error, value } = schema.validate(this.validation_object);

    if (error) {
      const { code } = CODE_MESSAGES.VALIDATION_ERROR;
      const { message } = error;

      throw new ValidationError({ code, message });
    }

    return value;
  }
}
