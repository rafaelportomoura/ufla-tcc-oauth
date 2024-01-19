import { FastifyReply, FastifyRequest } from 'fastify';
import { Validator } from '../adapters/validate';
import { ConfirmForgotPasswordBusiness } from '../business/confirmForgotPassword';
import { CODE_MESSAGES } from '../constants/codeMessages';
import { HTTP_STATUS_CODE } from '../constants/httpStatus';
import { confirm_forgot_password_schema } from '../schemas/forgot_password';
import { CodeMessage } from '../types/CodeMessage';

export async function confirmForgotPassword(req: FastifyRequest, res: FastifyReply): Promise<CodeMessage> {
  const validator = new Validator(confirm_forgot_password_schema);
  const body = await validator.validate(req.body);
  await new ConfirmForgotPasswordBusiness().confirm(body);
  res.status(HTTP_STATUS_CODE.OK);
  return CODE_MESSAGES.PASSWORD_CHANGED_RESPONSE;
}
