import { KMS } from '../aws/kms';
import { CreateUser, SetUserPassword, UserGroup } from '../types/User';
/* eslint-disable no-empty-function */
import { Cognito } from '../aws/cognito';
import { EVENTS, EVENTS_STATUS, EVENTS_TYPES } from '../constants/events';
import { CreateCustomerDTO } from '../dtos/customer';
import { EventBus } from '../services/EventBus';

export class CreateUserBusiness {
  constructor(
    private group: UserGroup,
    private kms = new KMS(),
    private cognito = new Cognito(),
    private event_bus = new EventBus()
  ) {}

  async create(payload: CreateCustomerDTO): Promise<void> {
    const password = await this.kms.decrypt(payload.password);
    await this.cognito.createUser(this.create_user_cognito_payload(payload));
    await this.cognito.setUserPassword(this.set_user_password_cognito_payload({ password, email: payload.email }));
    await this.event_bus.pub(
      { username: payload.email, group: this.group },
      { event: EVENTS.USER, type: EVENTS_TYPES.CREATED, status: EVENTS_STATUS.SUCCESS }
    );
  }

  create_user_cognito_payload(payload: CreateCustomerDTO): CreateUser {
    return {
      Username: payload.email,
      UserAttributes: [
        {
          Name: 'email',
          Value: payload.email
        },
        {
          Name: 'group',
          Value: this.group
        }
      ],
      ClientMetadata: {
        email: payload.email,
        group: this.group
      }
    };
  }

  set_user_password_cognito_payload(payload: CreateCustomerDTO): SetUserPassword {
    return {
      Username: payload.email,
      Password: payload.password,
      Permanent: true
    };
  }
}
