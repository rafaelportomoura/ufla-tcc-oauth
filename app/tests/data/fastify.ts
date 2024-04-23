import { FastifyRequest } from 'fastify';
import { IncomingHttpHeaders } from 'node:http';

type FastifyRequestMock = {
  body?: unknown;
  query?: unknown;
  params?: unknown;
  headers?: IncomingHttpHeaders;
};

export const fastify_request = (req?: FastifyRequestMock): FastifyRequest =>
  ({
    body: {},
    query: {},
    params: {},
    headers: {},
    ...req
  }) as FastifyRequest;
