import Joi from 'joi';
import { JoiSchema, JoiSchemaOptions } from 'joi-class-decorators';
import { User } from '../types/User';

@JoiSchemaOptions({
  allowUnknown: false
})
export class CreateCustomerDTO implements User {
  @JoiSchema(Joi.string().email().required())
  email: string;

  @JoiSchema(Joi.string().required())
  password: string;
}
