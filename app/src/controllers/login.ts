import { FastifyReply, FastifyRequest } from 'fastify';
import { Validator } from '../adapters/validate';
import { LoginBusiness } from '../business/login';
import { AWS_CONFIGURATION } from '../constants/aws';
import { CONFIGURATION } from '../constants/configuration';
import { HTTP_STATUS_CODE } from '../constants/httpStatus';
import { login_schema } from '../schemas/login';
import { LoginResponse } from '../types/Login';

export async function login(req: FastifyRequest, res: FastifyReply): Promise<LoginResponse> {
  const validator = new Validator(login_schema);
  const body = await validator.validate(req.body);
  const business = new LoginBusiness(
    CONFIGURATION.KEY_ARN,
    CONFIGURATION.COGNITO_USER_POLL,
    CONFIGURATION.COGNITO_CLIENT_ID,
    AWS_CONFIGURATION
  );
  const response = await business.login(body);
  res.status(HTTP_STATUS_CODE.CREATED);
  return response;
}
