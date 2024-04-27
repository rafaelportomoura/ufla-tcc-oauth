import { FastifyReply, FastifyRequest } from 'fastify';
import { StatusCodes } from 'http-status-codes';
import { Validator } from '../adapters/validate';
import { ForgotPasswordBusiness } from '../business/forgotPassword';

import { Logger } from '../adapters/logger';
import { Cognito } from '../aws/cognito';
import { aws_config } from '../aws/config';
import { CODE_MESSAGES } from '../constants/codeMessages';
import { CONFIGURATION } from '../constants/configuration';
import { BaseError } from '../exceptions/BaseError';
import { error_handler } from '../middlewares/error';
import { forgot_password_schema } from '../schemas/forgot_password';
import { CodeMessage } from '../types/CodeMessage';
import { request_id } from '../utils/requestId';

export async function forgotPassword(req: FastifyRequest, res: FastifyReply): Promise<CodeMessage | BaseError> {
  const logger = new Logger(CONFIGURATION.LOG_LEVEL, request_id(req));
  try {
    const validator = new Validator(forgot_password_schema);
    const forgot_password = await validator.validate(req.body);
    const business = new ForgotPasswordBusiness({
      cognito: new Cognito(
        CONFIGURATION.COGNITO_USER_POLL,
        CONFIGURATION.COGNITO_CLIENT_ID,
        CONFIGURATION.COGNITO_SCOPE,
        aws_config()
      )
    });
    await business.forgot(forgot_password);
    res.status(StatusCodes.CREATED);
    return CODE_MESSAGES.PASSWORD_CHANGED_RESPONSE;
  } catch (error) {
    const response = error_handler(logger, error, 'ForgotPasswordController');

    res.status(response.status);
    return response;
  }
}
