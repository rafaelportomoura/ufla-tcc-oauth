import Joi from 'joi';
import { JoiSchema, JoiSchemaOptions } from 'joi-class-decorators';
import { Login } from '../types/Login';

@JoiSchemaOptions({
  allowUnknown: false
})
export class LoginDTO implements Login {
  @JoiSchema(Joi.string().required())
  username: string;

  @JoiSchema(Joi.string().required())
  password: string;
}
