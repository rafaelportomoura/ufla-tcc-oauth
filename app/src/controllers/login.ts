import { FastifyReply, FastifyRequest } from 'fastify';
import { StatusCodes } from 'http-status-codes';
import { Validator } from '../adapters/validate';
import { LoginBusiness } from '../business/login';

import { aws_config } from '../aws/config';
import { CONFIGURATION } from '../constants/configuration';
import { login_schema } from '../schemas/login';
import { LoginResponse } from '../types/Login';

export async function login(req: FastifyRequest, res: FastifyReply): Promise<LoginResponse> {
  const validator = new Validator(login_schema);
  const body = await validator.validate(req.body);
  const business = new LoginBusiness(
    CONFIGURATION.KEY_ARN,
    CONFIGURATION.COGNITO_USER_POLL,
    CONFIGURATION.COGNITO_CLIENT_ID,
    aws_config()
  );
  const response = await business.login(body);
  res.status(StatusCodes.CREATED);
  return response;
}
