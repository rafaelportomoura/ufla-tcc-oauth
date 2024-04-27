import { StatusCodes } from 'http-status-codes';
import { FastifyReply, FastifyRequest } from 'fastify';
import { ValidateTokenResponse } from '../types/ValidateToken';
import { Validator } from '../adapters/validate';
import { token_schema } from '../schemas/token';
import { ValidateToken } from '../business/validateToken';
import { Cognito } from '../aws/cognito';
import { CONFIGURATION } from '../constants/configuration';
import { aws_config } from '../aws/config';

export async function validateTokenController(req: FastifyRequest, res: FastifyReply): Promise<ValidateTokenResponse> {
  const validator = new Validator(token_schema);
  const { token } = await validator.validate(req.body);
  const business = new ValidateToken({
    cognito: new Cognito(
      CONFIGURATION.COGNITO_USER_POLL,
      CONFIGURATION.COGNITO_CLIENT_ID,
      CONFIGURATION.COGNITO_SCOPE,
      aws_config()
    )
  });
  const response = await business.authorize(token);
  res.status(StatusCodes.OK);

  return response;
}
