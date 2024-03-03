import { FastifyReply, FastifyRequest } from 'fastify';
import { StatusCodes } from 'http-status-codes';
import { Validator } from '../adapters/validate';
import { ForgotPasswordBusiness } from '../business/forgotPassword';

import { aws_config } from '../aws/config';
import { CODE_MESSAGES } from '../constants/codeMessages';
import { CONFIGURATION } from '../constants/configuration';
import { forgot_password_schema } from '../schemas/forgot_password';
import { CodeMessage } from '../types/CodeMessage';

export async function forgotPassword(req: FastifyRequest, res: FastifyReply): Promise<CodeMessage> {
  const validator = new Validator(forgot_password_schema);
  const forgot_password = await validator.validate(req.body);
  const business = new ForgotPasswordBusiness(
    CONFIGURATION.COGNITO_USER_POLL,
    CONFIGURATION.COGNITO_CLIENT_ID,
    aws_config()
  );
  await business.forgot(forgot_password);
  res.status(StatusCodes.CREATED);
  return CODE_MESSAGES.PASSWORD_CHANGED_RESPONSE;
}
