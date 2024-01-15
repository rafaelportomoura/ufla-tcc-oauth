/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from 'express';
import { CODE_MESSAGES } from '../constants/codeMessages';
import { HTTP_STATUS_CODE } from '../constants/httpStatus';
import { BaseError } from '../exceptions/BaseError';
import { InternalServerError } from '../exceptions/InternalServerError';

export const error_middleware = (error: Error, _: Request, response: Response, __: NextFunction) => {
  if (error instanceof BaseError) return response.status(error.status).json(error);

  return response
    .status(HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR)
    .json(new InternalServerError(CODE_MESSAGES.INTERNAL_SERVER_ERROR));
};
