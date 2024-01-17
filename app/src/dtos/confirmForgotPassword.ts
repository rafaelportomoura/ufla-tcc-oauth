import Joi from 'joi';
import { JoiSchema, JoiSchemaOptions } from 'joi-class-decorators';
import { ConfirmForgotPassword } from '../types/User';

@JoiSchemaOptions({
  allowUnknown: false
})
export class ConfirmForgotPasswordDTO implements ConfirmForgotPassword {
  @JoiSchema(Joi.string().required())
  username: string;

  @JoiSchema(Joi.string().required())
  password: string;

  @JoiSchema(Joi.string().required())
  confirmation_code: string;
}
