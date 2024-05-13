/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable prettier/prettier */
import { FastifyReply, FastifyRequest } from 'fastify';
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

export const fastify_reply = (res?: Partial<FastifyReply>): FastifyReply =>
  ({
    send: (...args: any[]) => {},
    status: (...args: any[]) => {},
    ...res
  }) as FastifyReply;
