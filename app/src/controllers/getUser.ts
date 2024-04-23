import { FastifyReply, FastifyRequest } from 'fastify';
import { StatusCodes } from 'http-status-codes';
import { Validator } from '../adapters/validate';
import { GetUserBusiness } from '../business/getUser';

import { Cognito } from '../aws/cognito';
import { aws_config } from '../aws/config';
import { CONFIGURATION } from '../constants/configuration';
import { get_user_schema } from '../schemas/user';

export async function getUser(
  req: FastifyRequest,
  res: FastifyReply
): ReturnType<typeof GetUserBusiness.prototype.getUser> {
  const validator = new Validator(get_user_schema);
  req.log.info(req.params, 'tnc');
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
}
