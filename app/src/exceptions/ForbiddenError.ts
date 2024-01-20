import { CODE_MESSAGES } from '../constants/codeMessages';
import { HTTP_STATUS_CODE } from '../constants/httpStatus';
import { BaseError } from './BaseError';

export class ForbiddenError extends BaseError {
  constructor() {
    super(CODE_MESSAGES.FORBIDDEN, HTTP_STATUS_CODE.NOT_FOUND);
    this.name = 'ForbiddenError';
  }
}
