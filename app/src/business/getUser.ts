import { AdminGetUserResponse, AttributeType } from '@aws-sdk/client-cognito-identity-provider';
import { Cognito } from '../aws/cognito';
import { CODE_MESSAGES } from '../constants/codeMessages';
import { NotFoundError } from '../exceptions/NotFoundError';
import { AwsConfig } from '../types/Aws';
import { User } from '../types/User';

export class GetUserBusiness {
  private cognito: Cognito;

  constructor(pool_id: string, client_id: string, aws_config: AwsConfig) {
    this.cognito = new Cognito(pool_id, client_id, aws_config);
  }

  async getUser(username: string): Promise<User> {
    const user = await this.cognito.getUser(username);

    if (!user) throw new NotFoundError(CODE_MESSAGES.USER_NOT_FOUND);

    return this.map(user);
  }

  map(response: Required<AdminGetUserResponse>): User {
    const {
      Username: username,
      UserAttributes: attributes,
      Enabled: enabled,
      UserLastModifiedDate: updated_at,
      UserCreateDate: created_at,
      UserStatus: status
    } = response;

    return {
      username: username as string,
      enabled,
      updated_at,
      created_at,
      status,
      ...this.cognito.mapAttributes(attributes as Required<AttributeType>[])
    };
  }
}
