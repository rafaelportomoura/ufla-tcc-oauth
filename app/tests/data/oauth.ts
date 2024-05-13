/* eslint-disable import/no-extraneous-dependencies */
import { faker } from '@faker-js/faker';
import { ConfirmForgotPasswordRequest, LoginRequest } from '../../src/types/Cognito';

export class OAuthData {
  static login(d?: Partial<LoginRequest>): LoginRequest {
    return {
      username: faker.internet.userName(),
      password: faker.internet.password(),
      ...d
    };
  }

  static confirmForgotPassword(d?: Partial<ConfirmForgotPasswordRequest>): ConfirmForgotPasswordRequest {
    return {
      username: faker.internet.userName(),
      password: faker.internet.password(),
      confirmation_code: faker.number.int().toString(),
      ...d
    };
  }
}
