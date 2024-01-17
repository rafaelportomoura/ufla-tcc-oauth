import { CODE_MESSAGES } from '../constants/codeMessages';
/* eslint-disable no-empty-function */
import { Cognito } from '../aws/cognito';
import { BadRequestError } from '../exceptions/BadRequestError';

export class ForgotPasswordBusiness {
  constructor(private cognito = new Cognito()) {}

  async forgot(username: string): Promise<void> {
    try {
      await this.cognito.forgotPassword(username);
    } catch (error) {
      throw new BadRequestError(CODE_MESSAGES.CANT_FINALIZE_FORGOT_PASSWORD);
    }
  }
}
