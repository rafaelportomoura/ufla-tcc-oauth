import { StatusCodes } from 'http-status-codes';
import { CODE_MESSAGES } from '../constants/codeMessages';
import { BaseError } from './BaseError';

export class ForbiddenError extends BaseError {
  constructor() {
    super(CODE_MESSAGES.FORBIDDEN, StatusCodes.FORBIDDEN);
  }
}
