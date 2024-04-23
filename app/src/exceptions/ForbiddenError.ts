import { CognitoAccessTokenPayload } from 'aws-jwt-verify/jwt-model';
import { StatusCodes } from 'http-status-codes';
import { CODE_MESSAGES } from '../constants/codeMessages';
import { BaseError } from './BaseError';

export class ForbiddenError extends BaseError {
  public sub: string;

  constructor(decoded_token: CognitoAccessTokenPayload) {
    super(CODE_MESSAGES.FORBIDDEN, StatusCodes.FORBIDDEN);
    this.sub = decoded_token.sub;
  }
}
