import { FastifyReply, FastifyRequest } from 'fastify';
import { Validator } from '../adapters/validate';
import { BasicAuthBusiness } from '../business/basicAuth';
import { CreateUserBusiness } from '../business/createUser';
import { CODE_MESSAGES } from '../constants/codeMessages';
import { USER_COMMON_GROUPS } from '../constants/groups';
import { HTTP_STATUS_CODE } from '../constants/httpStatus';
import { create_user_schema } from '../schemas/user';
import { CodeMessage } from '../types/CodeMessage';

export async function sysAdminCreateAdmin(req: FastifyRequest, res: FastifyReply): Promise<CodeMessage> {
  const auth_string = req.headers.authorization?.split(' ')[1];
  await new BasicAuthBusiness().validate(auth_string as string);
  const validator = new Validator(create_user_schema);
  const body = await validator.validate(req.body);
  const business = new CreateUserBusiness(USER_COMMON_GROUPS.ADMIN, req.log);
  await business.create(body);
  res.status(HTTP_STATUS_CODE.OK);

  return CODE_MESSAGES.ADMIN_CREATED;
}
