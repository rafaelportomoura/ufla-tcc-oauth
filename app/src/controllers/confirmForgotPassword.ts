import { FastifyReply, FastifyRequest } from 'fastify';
import { StatusCodes } from 'http-status-codes';
import { Logger } from '../adapters/logger';
import { Validator } from '../adapters/validate';
import { Cognito } from '../aws/cognito';
import { aws_config } from '../aws/config';
import { ConfirmForgotPasswordBusiness } from '../business/confirmForgotPassword';
import { CODE_MESSAGES } from '../constants/codeMessages';
import { CONFIGURATION } from '../constants/configuration';
import { BaseError } from '../exceptions/BaseError';
import { error_handler } from '../middlewares/error';
import { confirm_forgot_password_schema } from '../schemas/forgot_password';
import { CodeMessage } from '../types/CodeMessage';
import { request_id } from '../utils/requestId';

export async function confirmForgotPassword(req: FastifyRequest, res: FastifyReply): Promise<CodeMessage | BaseError> {
  const logger = new Logger(CONFIGURATION.LOG_LEVEL, request_id(req));
  try {
    const validator = new Validator(confirm_forgot_password_schema);
    const body = await validator.validate(req.body);
    const business = new ConfirmForgotPasswordBusiness({
      cognito: new Cognito(
        CONFIGURATION.COGNITO_USER_POLL,
        CONFIGURATION.COGNITO_CLIENT_ID,
        CONFIGURATION.COGNITO_SCOPE,
        aws_config()
      )
    });
    await business.confirm(body);
    res.status(StatusCodes.OK);
    return CODE_MESSAGES.PASSWORD_CHANGED_RESPONSE;
  } catch (error) {
    const response = error_handler(logger, error, 'ConfirmForgotPasswordController');

    res.status(response.status);
    return response;
  }
}
