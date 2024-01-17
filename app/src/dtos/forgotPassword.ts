import Joi from 'joi';
import { JoiSchema, JoiSchemaOptions } from 'joi-class-decorators';

@JoiSchemaOptions({
  allowUnknown: false
})
export class ForgotPasswordDTO {
  @JoiSchema(Joi.string().required())
  username: string;
}
