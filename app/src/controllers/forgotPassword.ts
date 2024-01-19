import { FastifyReply, FastifyRequest } from 'fastify';
import { Validator } from '../adapters/validate';
import { ForgotPasswordBusiness } from '../business/forgotPassword';
import { CODE_MESSAGES } from '../constants/codeMessages';
import { HTTP_STATUS_CODE } from '../constants/httpStatus';
import { forgot_password_schema } from '../schemas/forgot_password';
import { CodeMessage } from '../types/CodeMessage';

export async function forgotPassword(req: FastifyRequest, res: FastifyReply): Promise<CodeMessage> {
  const validator = new Validator(forgot_password_schema);
  const forgot_password = await validator.validate(req.body);
  await new ForgotPasswordBusiness().forgot(forgot_password);
  res.status(HTTP_STATUS_CODE.OK);
  return CODE_MESSAGES.PASSWORD_CHANGED_RESPONSE;
}
