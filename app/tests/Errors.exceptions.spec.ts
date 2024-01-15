import { expect } from 'chai';
import { CODE_MESSAGES } from '../src/constants/codeMessages';
import { BadRequestError } from '../src/exceptions/BadRequestError';
import { BaseError } from '../src/exceptions/BaseError';
import { DatabaseError } from '../src/exceptions/DatabaseError';
import { InternalServerError } from '../src/exceptions/InternalServerError';
import { NotFoundError } from '../src/exceptions/NotFoundError';
import { ValidationError } from '../src/exceptions/ValidationError';

describe('Test Suit - BaseErrors', () => {
  it('Should create BadRequestError', () => {
    const error = new BadRequestError(CODE_MESSAGES.VALIDATION_ERROR);
    const { message } = CODE_MESSAGES.VALIDATION_ERROR;

    expect(error).instanceOf(BadRequestError);
    expect(String(error)).equal(`BadRequestError: ${message}`);
    expect(JSON.stringify(error)).deep.equal(
      JSON.stringify({ ...CODE_MESSAGES.VALIDATION_ERROR, name: 'BadRequestError' })
    );
  });

  it('Should create BaseError', () => {
    const error = new BaseError(CODE_MESSAGES.VALIDATION_ERROR, 400);
    const { message } = CODE_MESSAGES.VALIDATION_ERROR;

    expect(error).instanceOf(BaseError);
    expect(String(error)).equal(`BaseError: ${message}`);
    expect(JSON.stringify(error)).deep.equal(JSON.stringify({ ...CODE_MESSAGES.VALIDATION_ERROR, name: 'BaseError' }));
  });

  it('Should create DatabaseError', () => {
    const error = new DatabaseError(CODE_MESSAGES.CANNOT_ACCESS_DATABASE);
    const { message } = CODE_MESSAGES.CANNOT_ACCESS_DATABASE;

    expect(error).instanceOf(DatabaseError);
    expect(String(error)).equal(`DatabaseError: ${message}`);
    expect(JSON.stringify(error)).deep.equal(
      JSON.stringify({ ...CODE_MESSAGES.CANNOT_ACCESS_DATABASE, name: 'DatabaseError' })
    );
  });

  it('Should create InternalServerError', () => {
    const error = new InternalServerError(CODE_MESSAGES.INTERNAL_SERVER_ERROR);
    const { message } = CODE_MESSAGES.INTERNAL_SERVER_ERROR;

    expect(error).instanceOf(InternalServerError);
    expect(String(error)).equal(`InternalServerError: ${message}`);
    expect(JSON.stringify(error)).deep.equal(
      JSON.stringify({ ...CODE_MESSAGES.INTERNAL_SERVER_ERROR, name: 'InternalServerError' })
    );
  });

  it('Should create NotFoundError', () => {
    const error = new NotFoundError(CODE_MESSAGES.NOT_FOUND_ERROR);
    const { message } = CODE_MESSAGES.NOT_FOUND_ERROR;

    expect(error).instanceOf(NotFoundError);
    expect(String(error)).equal(`NotFoundError: ${message}`);
    expect(JSON.stringify(error)).deep.equal(
      JSON.stringify({ ...CODE_MESSAGES.NOT_FOUND_ERROR, name: 'NotFoundError' })
    );
  });

  it('Should create ValidationError', () => {
    const error = new ValidationError(CODE_MESSAGES.VALIDATION_ERROR);
    const { message } = CODE_MESSAGES.VALIDATION_ERROR;

    expect(error).instanceOf(ValidationError);
    expect(String(error)).equal(`ValidationError: ${message}`);
    expect(JSON.stringify(error)).deep.equal(
      JSON.stringify({ ...CODE_MESSAGES.VALIDATION_ERROR, name: 'ValidationError' })
    );
  });
});
