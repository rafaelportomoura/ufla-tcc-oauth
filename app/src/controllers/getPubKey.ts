import { FastifyReply, FastifyRequest } from 'fastify';
import { StatusCodes } from 'http-status-codes';
import { GetPubKey } from '../business/getPubKey';

import { Logger } from '../adapters/logger';
import { aws_config } from '../aws/config';
import { CONFIGURATION } from '../constants/configuration';
import { BaseError } from '../exceptions/BaseError';
import { error_handler } from '../middlewares/error';
import { PubKey } from '../types/Kms';
import { request_id } from '../utils/requestId';

export async function getPubKey(_: FastifyRequest, res: FastifyReply): Promise<PubKey | BaseError> {
  const logger = new Logger(CONFIGURATION.LOG_LEVEL, request_id(_));
  try {
    const business = new GetPubKey(CONFIGURATION.KEY_ARN, aws_config());
    const response = await business.get();
    res.status(StatusCodes.OK);

    return response;
  } catch (error) {
    const response = error_handler(logger, error, 'GetPubKey');

    res.status(response.status);
    return response;
  }
}
