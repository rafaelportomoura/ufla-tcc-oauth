import { CognitoAccessTokenPayload } from 'aws-jwt-verify/jwt-model';
import { ValidateTokenArgs, ValidateTokenResponse } from '../types/ValidateToken';
import { Cognito } from '../aws/cognito';
import { UnauthorizedError } from '../exceptions/Unauthorized';
import { BaseError } from '../exceptions/BaseError';

export class ValidateToken {
  private cognito: Cognito;

  constructor(args: ValidateTokenArgs) {
    this.cognito = args.cognito;
  }

  async authorize(token: string): Promise<ValidateTokenResponse> {
    try {
      const decoded_token = await this.cognito.verify<CognitoAccessTokenPayload>(token);
      const { username } = decoded_token;
      const user = await this.cognito.getUser(username);
      const group = this.cognito.getGroup(user.UserAttributes);

      return { decoded_token, group };
    } catch (error) {
      throw error instanceof BaseError ? error : new UnauthorizedError();
    }
  }
}
