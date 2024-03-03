import { FastifyReply, FastifyRequest } from 'fastify';
import { StatusCodes } from 'http-status-codes';
import { GetPubKey } from '../business/getPubKey';

import { aws_config } from '../aws/config';
import { CONFIGURATION } from '../constants/configuration';
import { PubKey } from '../types/Kms';

export async function getPubKey(_: FastifyRequest, res: FastifyReply): Promise<PubKey> {
  const business = new GetPubKey(CONFIGURATION.KEY_ARN, aws_config());
  const response = await business.get();
  res.status(StatusCodes.OK);

  return response;
}
