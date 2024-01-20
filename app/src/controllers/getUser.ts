import { FastifyReply, FastifyRequest } from 'fastify';
import { Validator } from '../adapters/validate';
import { GetUserBusiness } from '../business/getUser';
import { AWS_CONFIGURATION } from '../constants/aws';
import { CONFIGURATION } from '../constants/configuration';
import { HTTP_STATUS_CODE } from '../constants/httpStatus';
import { get_user_schema } from '../schemas/user';

export async function getUser(
  req: FastifyRequest,
  res: FastifyReply
): ReturnType<typeof GetUserBusiness.prototype.getUser> {
  const validator = new Validator(get_user_schema);
  req.log.info(req.params, 'tnc');
  const { username } = await validator.validate(req.params);
  const business = new GetUserBusiness(
    CONFIGURATION.COGNITO_USER_POLL,
    CONFIGURATION.COGNITO_CLIENT_ID,
    AWS_CONFIGURATION
  );
  const user = await business.getUser(username);

  res.status(HTTP_STATUS_CODE.OK);
  return user;
}
