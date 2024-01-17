import Joi from 'joi';
import { JoiSchema, JoiSchemaOptions } from 'joi-class-decorators';

@JoiSchemaOptions({
  allowUnknown: false
})
export class CreateUserDTO {
  @JoiSchema(Joi.string().required())
  username: string;

  @JoiSchema(Joi.string().email().required())
  email: string;

  @JoiSchema(Joi.string().required())
  password: string;
}
