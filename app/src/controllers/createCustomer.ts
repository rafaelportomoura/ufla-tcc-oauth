import { FastifyReply, FastifyRequest } from 'fastify';
import { StatusCodes } from 'http-status-codes';
import { Validator } from '../adapters/validate';
import { Cognito } from '../aws/cognito';
import { CreateUserBusiness } from '../business/createUser';

import { aws_config } from '../aws/config';
import { KMS } from '../aws/kms';
import { CODE_MESSAGES } from '../constants/codeMessages';
import { CONFIGURATION } from '../constants/configuration';
import { USER_COMMON_GROUPS } from '../constants/groups';
import { create_user_schema } from '../schemas/user';
import { CodeMessage } from '../types/CodeMessage';

export async function createCustomer(req: FastifyRequest, res: FastifyReply): Promise<CodeMessage> {
  const validator = new Validator(create_user_schema);
  const body = await validator.validate(req.body);
  const business = new CreateUserBusiness({
    group: USER_COMMON_GROUPS.CUSTOMER,
    cognito: new Cognito(
      CONFIGURATION.COGNITO_USER_POLL,
      CONFIGURATION.COGNITO_CLIENT_ID,
      CONFIGURATION.COGNITO_SCOPE,
      aws_config()
    ),
    kms: new KMS(CONFIGURATION.KEY_ARN, aws_config())
  });

  await business.create(body);
  res.status(StatusCodes.CREATED);
  return CODE_MESSAGES.CUSTOMER_CREATED;
}
