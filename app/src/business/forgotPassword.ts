import { CODE_MESSAGES } from '../constants/codeMessages';
/* eslint-disable no-empty-function */
import { Cognito } from '../aws/cognito';
import { BadRequestError } from '../exceptions/BadRequestError';
import { AwsConfig } from '../types/Aws';
import { ForgotPassword } from '../types/ForgotPassword';

export class ForgotPasswordBusiness {
  private cognito: Cognito;

  constructor(pool_id: string, client_id: string, config: AwsConfig) {
    this.cognito = new Cognito(pool_id, client_id, config);
  }

  async forgot({ username }: ForgotPassword): Promise<void> {
    try {
      await this.cognito.forgotPassword(username);
    } catch (error) {
      throw new BadRequestError(CODE_MESSAGES.CANT_FINALIZE_FORGOT_PASSWORD);
    }
  }
}
