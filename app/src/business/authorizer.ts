/* eslint-disable no-empty-function */
import { Cognito } from '../aws/cognito';
import { AuthorizerArgs } from '../types/Authorizer';

export class Authorizer {
  private cognito: Cognito;

  constructor(args: AuthorizerArgs) {
    this.cognito = args.cognito;
  }

  async authorize(token: string): Promise<boolean> {
    try {
      await this.cognito.verify(token);
      return true;
    } catch (error) {
      return false;
    }
  }
}
