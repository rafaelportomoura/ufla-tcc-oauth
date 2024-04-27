import { FastifyReply, FastifyRequest } from 'fastify';
import { StatusCodes } from 'http-status-codes';
import { Validator } from '../adapters/validate';
import { GetUserBusiness } from '../business/getUser';

import { Logger } from '../adapters/logger';
import { Cognito } from '../aws/cognito';
import { aws_config } from '../aws/config';
import { CONFIGURATION } from '../constants/configuration';
import { BaseError } from '../exceptions/BaseError';
import { error_handler } from '../middlewares/error';
import { get_user_schema } from '../schemas/user';
import { User } from '../types/User';
import { request_id } from '../utils/requestId';

export async function getUser(req: FastifyRequest, res: FastifyReply): Promise<User | BaseError> {
  const logger = new Logger(CONFIGURATION.LOG_LEVEL, request_id(req));
  try {
    const validator = new Validator(get_user_schema);
    const { username } = await validator.validate(req.params);
    const business = new GetUserBusiness({
      cognito: new Cognito(
        CONFIGURATION.COGNITO_USER_POLL,
        CONFIGURATION.COGNITO_CLIENT_ID,
        CONFIGURATION.COGNITO_SCOPE,
        aws_config()
      )
    });
    const user = await business.getUser(username);

    res.status(StatusCodes.OK);
    return user;
  } catch (error) {
    const response = error_handler(logger, error, 'GetUser');

    res.status(response.status);
    return response;
  }
}
