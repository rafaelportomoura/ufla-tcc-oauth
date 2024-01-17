/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from 'express';
import { Logger } from '../adapters/logger';
import { CODE_MESSAGES } from '../constants/codeMessages';
import { HTTP_STATUS_CODE } from '../constants/httpStatus';
import { BaseError } from '../exceptions/BaseError';
import { InternalServerError } from '../exceptions/InternalServerError';
import { create_request_id } from '../utils/createRequestId';

export const error_middleware = (error: Error, req: Request, response: Response, __: NextFunction) => {
  const logger = new Logger(create_request_id(req));
  logger.error(error);

  if (error instanceof BaseError) return response.status(error.status).json(error);

  return response
    .status(HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR)
    .json(new InternalServerError(CODE_MESSAGES.INTERNAL_SERVER_ERROR));
};
