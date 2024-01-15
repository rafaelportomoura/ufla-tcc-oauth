import * as Joi from 'joi';
import { JoiSchema, JoiSchemaOptions } from 'joi-class-decorators';

@JoiSchemaOptions({
  allowUnknown: true
})
export class ExampleDTO {
  @JoiSchema(Joi.string().required())
  id!: string;

  @JoiSchema(Joi.string().required())
  name!: string;
}
