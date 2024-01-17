import { InvalidParameterException } from '@aws-sdk/client-cognito-identity-provider';
import { CODE_MESSAGES } from '../constants/codeMessages';
import { BadRequestError } from './BadRequestError';
import { BaseError } from './BaseError';

export function cognitoErrorHandler(error: unknown): BaseError | unknown {
  if (error instanceof InvalidParameterException)
    return new BadRequestError({ code: CODE_MESSAGES.VALIDATION_ERROR.code, message: error.message });

  return error;
}
