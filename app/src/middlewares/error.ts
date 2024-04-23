import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { StatusCodes } from 'http-status-codes';
import { CODE_MESSAGES } from '../constants/codeMessages';
import { BaseError } from '../exceptions/BaseError';
import { InternalServerError } from '../exceptions/InternalServerError';

export const error_middleware =
  (server: FastifyInstance) => (error: Error, req: FastifyRequest, reply: FastifyReply) => {
    server.log.error(error, error.message);

    if (error instanceof BaseError) {
      reply.status(error.status).send(error.toJSON());
      return;
    }

    reply.status(StatusCodes.INTERNAL_SERVER_ERROR).send(new InternalServerError(CODE_MESSAGES.INTERNAL_SERVER_ERROR));
  };
