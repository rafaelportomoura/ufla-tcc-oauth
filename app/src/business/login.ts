import { AuthenticationResultType } from '@aws-sdk/client-cognito-identity-provider';
import { KMS } from '../aws/kms';
/* eslint-disable no-empty-function */
import { Cognito } from '../aws/cognito';
import { AwsConfig } from '../types/Aws';
import { Login, LoginResponse } from '../types/Login';

export class LoginBusiness {
  private kms: KMS;

  private cognito: Cognito;

  constructor(key_arn: string, pool_id: string, client_id: string, config: AwsConfig) {
    this.kms = new KMS(key_arn, config);
    this.cognito = new Cognito(pool_id, client_id, config);
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
