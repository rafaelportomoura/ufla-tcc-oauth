import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { CODE_MESSAGES } from '../constants/codeMessages';
import { HTTP_STATUS_CODE } from '../constants/httpStatus';
import { BaseError } from '../exceptions/BaseError';
import { InternalServerError } from '../exceptions/InternalServerError';

export const error_middleware =
  (server: FastifyInstance) => (error: Error, req: FastifyRequest, reply: FastifyReply) => {
    server.log.error(error, error.message);

    if (error instanceof BaseError) {
      reply.status(error.status).send(error.toJSON());
      return;
    }

    reply
      .status(HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR)
      .send(new InternalServerError(CODE_MESSAGES.INTERNAL_SERVER_ERROR));
  };
