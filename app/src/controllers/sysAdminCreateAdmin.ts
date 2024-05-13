import { FastifyReply, FastifyRequest } from 'fastify';
import { StatusCodes } from 'http-status-codes';
import { Validator } from '../adapters/validate';
import { BasicAuthBusiness } from '../business/basicAuth';
import { CreateUserBusiness } from '../business/createUser';

import { Logger } from '../adapters/logger';
import { Cognito } from '../aws/cognito';
import { aws_config } from '../aws/config';
import { KMS } from '../aws/kms';
import { SecretsManager } from '../aws/secretsManager';
import { ListUserBusiness } from '../business/listUser';
import { CODE_MESSAGES } from '../constants/codeMessages';
import { CONFIGURATION } from '../constants/configuration';
import { USER_COMMON_GROUPS } from '../constants/groups';
import { BaseError } from '../exceptions/BaseError';
import { error_handler } from '../middlewares/error';
import { create_user_schema } from '../schemas/user';
import { CodeMessage } from '../types/CodeMessage';
import { request_id } from '../utils/requestId';

export async function sysAdminCreateAdmin(req: FastifyRequest, res: FastifyReply): Promise<CodeMessage | BaseError> {
  const logger = new Logger(CONFIGURATION.LOG_LEVEL, request_id(req));
  try {
    const auth_string = req.headers.authorization?.split(' ')[1];
    const basic_auth_business = new BasicAuthBusiness({
      secret: new SecretsManager(aws_config()),
      secret_path: CONFIGURATION.BASIC_AUTH_SECRET,
      logger
    });
    await basic_auth_business.validate(auth_string as string);
    const validator = new Validator(create_user_schema);
    const body = await validator.validate(req.body);
    const cognito = new Cognito(
      CONFIGURATION.COGNITO_USER_POLL,
      CONFIGURATION.COGNITO_CLIENT_ID,
      CONFIGURATION.COGNITO_SCOPE,
      aws_config()
    );
    const list_users = new ListUserBusiness({ cognito });
    const { users } = await list_users.list({ page: 1, size: 1 });
    if (users.length > 0) {
      res.status(StatusCodes.CONFLICT);
      return CODE_MESSAGES.ALREADY_HAS_USERS;
    }
    const business = new CreateUserBusiness({
      group: USER_COMMON_GROUPS.ADMIN,
      cognito,
      kms: new KMS(CONFIGURATION.KEY_ARN, aws_config())
    });
    await business.create(body);
    res.status(StatusCodes.CREATED);

    return CODE_MESSAGES.ADMIN_CREATED;
  } catch (error) {
    const response = error_handler(logger, error, 'SysAdminCreate');

    res.status(response.status);
    return response;
  }
}
