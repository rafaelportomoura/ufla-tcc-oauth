import { FastifyReply, FastifyRequest } from 'fastify';
import { StatusCodes } from 'http-status-codes';
import { Validator } from '../adapters/validate';
import { BasicAuthBusiness } from '../business/basicAuth';
import { CreateUserBusiness } from '../business/createUser';

import { aws_config } from '../aws/config';
import { CODE_MESSAGES } from '../constants/codeMessages';
import { CONFIGURATION } from '../constants/configuration';
import { USER_COMMON_GROUPS } from '../constants/groups';
import { create_user_schema } from '../schemas/user';
import { CodeMessage } from '../types/CodeMessage';

export async function sysAdminCreateAdmin(req: FastifyRequest, res: FastifyReply): Promise<CodeMessage> {
  const auth_string = req.headers.authorization?.split(' ')[1];
  const basic_auth_business = new BasicAuthBusiness(CONFIGURATION.BASIC_AUTH_SECRET, aws_config());
  await basic_auth_business.validate(auth_string as string);
  const validator = new Validator(create_user_schema);
  const body = await validator.validate(req.body);
  const business = new CreateUserBusiness(
    req.log,
    USER_COMMON_GROUPS.ADMIN,
    CONFIGURATION.KEY_ARN,
    CONFIGURATION.COGNITO_USER_POLL,
    CONFIGURATION.COGNITO_CLIENT_ID,
    CONFIGURATION.EVENT_BUS,
    aws_config()
  );
  await business.create(body);
  res.status(StatusCodes.OK);

  return CODE_MESSAGES.ADMIN_CREATED;
}
