import { FastifyReply, FastifyRequest } from 'fastify';
import { StatusCodes } from 'http-status-codes';
import { Logger } from '../adapters/logger';
import { Validator } from '../adapters/validate';
import { Cognito } from '../aws/cognito';
import { aws_config } from '../aws/config';
import { ValidateToken } from '../business/validateToken';
import { CONFIGURATION } from '../constants/configuration';
import { BaseError } from '../exceptions/BaseError';
import { error_handler } from '../middlewares/error';
import { token_schema } from '../schemas/token';
import { ValidateTokenResponse } from '../types/ValidateToken';
import { request_id } from '../utils/requestId';

export async function validateTokenController(
  req: FastifyRequest,
  res: FastifyReply
): Promise<ValidateTokenResponse | BaseError> {
  const logger = new Logger(CONFIGURATION.LOG_LEVEL, request_id(req));
  try {
    const validator = new Validator(token_schema);
    const { token } = await validator.validate(req.body);
    const business = new ValidateToken({
      cognito: new Cognito(
        CONFIGURATION.COGNITO_USER_POLL,
        CONFIGURATION.COGNITO_CLIENT_ID,
        CONFIGURATION.COGNITO_SCOPE,
        aws_config()
      )
    });
    const response = await business.authorize(token);
    res.status(StatusCodes.OK);

    return response;
  } catch (error) {
    const response = error_handler(logger, error, 'ValidateTokenController');

    res.status(response.status);
    return response;
  }
}
