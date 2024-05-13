/* eslint-disable no-empty-function */
import { InvalidParameterException } from '@aws-sdk/client-cognito-identity-provider';
import { Cognito } from '../aws/cognito';
import { KMS } from '../aws/kms';
import { CODE_MESSAGES } from '../constants/codeMessages';
import { BadRequestError } from '../exceptions/BadRequestError';
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
      if (error instanceof InvalidParameterException)
        throw new BadRequestError({ code: CODE_MESSAGES.VALIDATION_ERROR.code, message: error.message });

      throw error;
    }
  }

  set_user_password_cognito_payload(username: string, password: string): SetUserPasswordCognito {
    return { username, password, permanent: true };
  }
}
