import { CODE_MESSAGES } from '../constants/codeMessages';
/* eslint-disable no-empty-function */
import { Cognito } from '../aws/cognito';
import { BadRequestError } from '../exceptions/BadRequestError';
import { AwsConfig } from '../types/Aws';
import { ConfirmForgotPassword } from '../types/ForgotPassword';

export class ConfirmForgotPasswordBusiness {
  private cognito: Cognito;

  constructor(pool_id: string, client_id: string, config: AwsConfig) {
    this.cognito = new Cognito(pool_id, client_id, config);
  }

  async confirm(payload: ConfirmForgotPassword): Promise<void> {
    try {
      await this.cognito.confirmForgotPassword(payload);
    } catch (error) {
      throw new BadRequestError(CODE_MESSAGES.CANT_FINALIZE_CONFIRMATION_FORGOT_PASSWORD);
    }
  }
}
