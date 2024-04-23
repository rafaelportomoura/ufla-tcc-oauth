/* eslint-disable no-empty-function */
import { Cognito } from '../aws/cognito';
import { KMS } from '../aws/kms';
import { cognitoErrorHandler } from '../exceptions/cognitoErrorHandler';
import { CreateUserArgs } from '../types/CreateUserArgs';
import { CreateUser, SetUserPasswordCognito, UserGroup } from '../types/User';

export class CreateUserBusiness {
  private group: UserGroup;

  private kms: KMS;

  private cognito: Cognito;

  constructor(args: CreateUserArgs) {
    this.group = args.group;
    this.kms = args.kms;
    this.cognito = args.cognito;
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
