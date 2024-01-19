import { AdminSetUserPasswordRequest } from '@aws-sdk/client-cognito-identity-provider';
import { FastifyBaseLogger } from 'fastify';
import { KMS } from '../aws/kms';
import { CreateUser, SetUserPassword, User, UserGroup } from '../types/User';
/* eslint-disable no-empty-function */
import { Cognito } from '../aws/cognito';
import { EVENTS, EVENTS_STATUS, EVENTS_TYPES } from '../constants/events';
import { cognitoErrorHandler } from '../exceptions/cognitoErrorHandler';
import { EventBus } from '../services/EventBus';

export class CreateUserBusiness {
  private group: UserGroup;

  private kms: KMS;

  private cognito: Cognito;

  private event_bus: EventBus;

  constructor(
    group: UserGroup,
    private logger: FastifyBaseLogger
  ) {
    this.group = group;
    this.kms = new KMS();
    this.cognito = new Cognito();
    this.event_bus = new EventBus();
  }

  async create(payload: CreateUser): Promise<void> {
    try {
      const password = await this.kms.decrypt(payload.password);
      await this.cognito.createUser(this.create_user_cognito_payload(payload));
      await this.cognito.setUserPassword(
        this.set_user_password_cognito_payload({ password, username: payload.username })
      );
      await this.event_bus.pub(
        { username: payload.email, group: this.group },
        { event: EVENTS.USER, type: EVENTS_TYPES.CREATED, status: EVENTS_STATUS.SUCCESS }
      );
    } catch (error) {
      throw cognitoErrorHandler(error);
    }
  }

  create_user_cognito_payload(payload: CreateUser): User {
    return { ...payload, 'custom:group': this.group };
  }

  set_user_password_cognito_payload(payload: SetUserPassword): Omit<AdminSetUserPasswordRequest, 'UserPoolId'> {
    return {
      Username: payload.username,
      Password: payload.password,
      Permanent: true
    };
  }
}
