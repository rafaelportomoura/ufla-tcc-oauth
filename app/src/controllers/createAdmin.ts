import { FastifyReply, FastifyRequest } from 'fastify';
import { Validator } from '../adapters/validate';
import { CreateUserBusiness } from '../business/createUser';
import { CODE_MESSAGES } from '../constants/codeMessages';
import { USER_COMMON_GROUPS } from '../constants/groups';
import { HTTP_STATUS_CODE } from '../constants/httpStatus';
import { create_user_schema } from '../schemas/user';
import { CodeMessage } from '../types/CodeMessage';

export async function createAdmin(req: FastifyRequest, res: FastifyReply): Promise<CodeMessage> {
  const validator = new Validator(create_user_schema);
  const body = await validator.validate(req.body);
  const business = new CreateUserBusiness(USER_COMMON_GROUPS.ADMIN, req.log);
  await business.create(body);

  res.status(HTTP_STATUS_CODE.CREATED);
  return CODE_MESSAGES.CUSTOMER_CREATED;
}
