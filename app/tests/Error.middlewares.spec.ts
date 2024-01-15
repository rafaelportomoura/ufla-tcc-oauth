import { expect } from 'chai';
import { CODE_MESSAGES } from '../src/constants/codeMessages';
import { HTTP_STATUS_CODE } from '../src/constants/httpStatus';
import { BadRequestError } from '../src/exceptions/BadRequestError';
import { InternalServerError } from '../src/exceptions/InternalServerError';
import { error_middleware } from '../src/middlewares/error';
import { MockExpress } from './mocks/express';

describe('Unit Test middlewares/error.ts', () => {
  it('Should return base error instance status and json when was call with base error instance', () => {
    const error_mock = new BadRequestError(CODE_MESSAGES.VALIDATION_ERROR);

    const response = error_middleware(
      error_mock,
      MockExpress.request(),
      MockExpress.response(),
      () => {}
    ) as unknown as Record<string, unknown>;

    expect(response.body).to.equal(JSON.stringify(error_mock));
    expect(response.statusCode).to.equal(HTTP_STATUS_CODE.BAD_REQUEST);
  });

  it('Should return internal server error status and json when was call with unknown error', () => {
    const response = error_middleware(
      new Error('jaca'),
      MockExpress.request(),
      MockExpress.response(),
      () => {}
    ) as unknown as Record<string, unknown>;

    expect(response.body).to.equal(JSON.stringify(new InternalServerError(CODE_MESSAGES.INTERNAL_SERVER_ERROR)));
    expect(response.statusCode).to.equal(HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR);
  });
});
