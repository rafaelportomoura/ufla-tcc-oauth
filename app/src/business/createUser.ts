import { KMS } from '../aws/kms';
import { CreateUser, SetUserPasswordCognito, UserGroup } from '../types/User';
/* eslint-disable no-empty-function */
import { Cognito } from '../aws/cognito';
import { cognitoErrorHandler } from '../exceptions/cognitoErrorHandler';
import { AwsConfig } from '../types/Aws';

export class CreateUserBusiness {
  private group: UserGroup;

  private kms: KMS;

  private cognito: Cognito;

  constructor(group: UserGroup, key_arn: string, pool_id: string, client_id: string, config: AwsConfig) {
    this.group = group;
    this.kms = new KMS(key_arn, config);
    this.cognito = new Cognito(pool_id, client_id, config);
  }

  async create(payload: CreateUser): Promise<void> {
    try {
      const password = await this.kms.decrypt(payload.password);
      await this.cognito.createUser(payload, this.group);
      await this.cognito.setUserPassword(this.set_user_password_cognito_payload(payload.username, password));
    } catch (error) {
      throw cognitoErrorHandler(error);
    }
  }

  set_user_password_cognito_payload(username: string, password: string): SetUserPasswordCognito {
    return { username, password, permanent: true };
  }
}
