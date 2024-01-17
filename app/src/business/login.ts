import { KMS } from '../aws/kms';
/* eslint-disable no-empty-function */
import { Cognito } from '../aws/cognito';
import { Login, LoginResponse } from '../types/Login';

export class LoginBusiness {
  constructor(
    private cognito = new Cognito(),
    private kms = new KMS()
  ) {}

  async login({ username, password: encrypted_password }: Login): Promise<LoginResponse> {
    const password = await this.kms.decrypt(encrypted_password);
    const { AuthenticationResult: auth_result } = await this.cognito.login({ username, password });
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
