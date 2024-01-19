import { CODE_MESSAGES } from '../constants/codeMessages';
/* eslint-disable no-empty-function */
import { Cognito } from '../aws/cognito';
import { BadRequestError } from '../exceptions/BadRequestError';
import { ConfirmForgotPassword } from '../types/ForgotPassword';

export class ConfirmForgotPasswordBusiness {
  constructor(private cognito = new Cognito()) {}

  async confirm(payload: ConfirmForgotPassword): Promise<void> {
    try {
      await this.cognito.confirmForgotPassword(payload);
    } catch (error) {
      throw new BadRequestError(CODE_MESSAGES.CANT_FINALIZE_CONFIRMATION_FORGOT_PASSWORD);
    }
  }
}
