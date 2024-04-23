import { CODE_MESSAGES } from '../constants/codeMessages';
/* eslint-disable no-empty-function */
import { Cognito } from '../aws/cognito';
import { BadRequestError } from '../exceptions/BadRequestError';
import { ForgotPassword, ForgotPasswordArgs } from '../types/ForgotPassword';

export class ForgotPasswordBusiness {
  private cognito: Cognito;

  constructor(args: ForgotPasswordArgs) {
    this.cognito = args.cognito;
  }

  async forgot({ username }: ForgotPassword): Promise<void> {
    try {
      await this.cognito.forgotPassword(username);
    } catch (error) {
      throw new BadRequestError(CODE_MESSAGES.CANT_FINALIZE_FORGOT_PASSWORD);
    }
  }
}
