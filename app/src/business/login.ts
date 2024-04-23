import { AuthenticationResultType } from '@aws-sdk/client-cognito-identity-provider';
import { KMS } from '../aws/kms';
/* eslint-disable no-empty-function */
import { Cognito } from '../aws/cognito';
import { Login, LoginArgs, LoginResponse } from '../types/Login';

export class LoginBusiness {
  private kms: KMS;

  private cognito: Cognito;

  constructor(args: LoginArgs) {
    this.kms = args.kms;
    this.cognito = args.cognito;
  }

  async login({ username, password: encrypted_password }: Login): Promise<LoginResponse> {
    const password = await this.kms.decrypt(encrypted_password);
    const login_response = await this.cognito.login({ username, password });
    const auth_result = login_response.AuthenticationResult as Required<AuthenticationResultType>;
    const { UserAttributes } = await this.cognito.getUser(username);
    const group = UserAttributes.find((v) => v.Name === 'group')?.Value;

    return {
      access_token: auth_result.AccessToken,
      refresh_token: auth_result.RefreshToken,
      expiration_time: auth_result.ExpiresIn,
      token_type: auth_result.TokenType,
      group
    };
  }
}
