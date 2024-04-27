import { FastifyReply, FastifyRequest } from 'fastify';
import { StatusCodes } from 'http-status-codes';
import { Validator } from '../adapters/validate';
import { LoginBusiness } from '../business/login';

import { Logger } from '../adapters/logger';
import { Cognito } from '../aws/cognito';
import { aws_config } from '../aws/config';
import { KMS } from '../aws/kms';
import { CONFIGURATION } from '../constants/configuration';
import { BaseError } from '../exceptions/BaseError';
import { error_handler } from '../middlewares/error';
import { login_schema } from '../schemas/login';
import { LoginResponse } from '../types/Login';
import { request_id } from '../utils/requestId';

export async function login(req: FastifyRequest, res: FastifyReply): Promise<LoginResponse | BaseError> {
  const logger = new Logger(CONFIGURATION.LOG_LEVEL, request_id(req));
  try {
    const validator = new Validator(login_schema);
    const body = await validator.validate(req.body);
    const business = new LoginBusiness({
      cognito: new Cognito(
        CONFIGURATION.COGNITO_USER_POLL,
        CONFIGURATION.COGNITO_CLIENT_ID,
        CONFIGURATION.COGNITO_SCOPE,
        aws_config()
      ),
      kms: new KMS(CONFIGURATION.KEY_ARN, aws_config())
    });
    const response = await business.login(body);
    res.status(StatusCodes.CREATED);
    return response;
  } catch (error) {
    const response = error_handler(logger, error, 'Login');

    res.status(response.status);
    return response;
  }
}
