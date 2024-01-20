import { FastifyBaseLogger } from 'fastify';
import { KMS } from '../aws/kms';
import { CreateUser, SetUserPasswordCognito, UserGroup } from '../types/User';
/* eslint-disable no-empty-function */
import { Cognito } from '../aws/cognito';
import { EVENTS, EVENTS_STATUS, EVENTS_TYPES } from '../constants/events';
import { cognitoErrorHandler } from '../exceptions/cognitoErrorHandler';
import { EventBus } from '../services/EventBus';
import { AwsConfig } from '../types/Aws';

export class CreateUserBusiness {
  private group: UserGroup;

  private kms: KMS;

  private cognito: Cognito;

  private event_bus: EventBus;

  constructor(
    private logger: FastifyBaseLogger,
    group: UserGroup,
    key_arn: string,
    pool_id: string,
    client_id: string,
    event_bus: string,
    config: AwsConfig
  ) {
    this.group = group;
    this.kms = new KMS(key_arn, config);
    this.cognito = new Cognito(pool_id, client_id, config);
    this.event_bus = new EventBus(this.logger, event_bus, config);
  }

  async create(payload: CreateUser): Promise<void> {
    try {
      const password = await this.kms.decrypt(payload.password);
      await this.cognito.createUser(payload, this.group);
      await this.cognito.setUserPassword(this.set_user_password_cognito_payload(payload.username, password));
      await this.event_bus.pub(
        { username: payload.email, group: this.group },
        { event: EVENTS.USER, type: EVENTS_TYPES.CREATED, status: EVENTS_STATUS.SUCCESS }
      );
    } catch (error) {
      throw cognitoErrorHandler(error);
    }
  }

  set_user_password_cognito_payload(username: string, password: string): SetUserPasswordCognito {
    return { username, password, permanent: true };
  }
}
