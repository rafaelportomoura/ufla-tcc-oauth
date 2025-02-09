import { CODE_MESSAGES } from '../constants/codeMessages';
/* eslint-disable no-empty-function */
import { Cognito } from '../aws/cognito';
import { BadRequestError } from '../exceptions/BadRequestError';
import { ConfirmForgotPassword, ConfirmForgotPasswordArgs } from '../types/ForgotPassword';

export class ConfirmForgotPasswordBusiness {
  private cognito: Cognito;

  constructor(args: ConfirmForgotPasswordArgs) {
    this.cognito = args.cognito;
  }

  async confirm(payload: ConfirmForgotPassword): Promise<void> {
    try {
      await this.cognito.confirmForgotPassword(payload);
    } catch (error) {
      throw new BadRequestError(CODE_MESSAGES.CANT_FINALIZE_CONFIRMATION_FORGOT_PASSWORD);
    }
  }
}
