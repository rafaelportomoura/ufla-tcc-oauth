import { FastifyReply, FastifyRequest } from 'fastify';
import { GetPubKey } from '../business/getPubKey';
import { HTTP_STATUS_CODE } from '../constants/httpStatus';
import { PubKey } from '../types/Kms';

export async function getPubKey(_: FastifyRequest, res: FastifyReply): Promise<PubKey> {
  const business = new GetPubKey();
  const response = await business.get();
  res.status(HTTP_STATUS_CODE.OK);

  return response;
}
