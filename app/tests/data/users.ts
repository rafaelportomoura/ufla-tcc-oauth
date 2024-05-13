/* eslint-disable import/no-extraneous-dependencies */
import { AttributeType } from '@aws-sdk/client-cognito-identity-provider';
import { faker } from '@faker-js/faker';
import { USER_COMMON_GROUPS } from '../../src/constants/groups';
import { CreateUser, SetUserPasswordCognito, User, UserAttributes } from '../../src/types/User';

export class UsersData {
  static create_user(d?: Partial<CreateUser>): CreateUser {
    return {
      username: faker.internet.userName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      ...d
    };
  }

  static username(): string {
    return faker.internet.userName();
  }

  static userAttributes(d?: Partial<UserAttributes>): UserAttributes {
    return {
      sub: faker.string.uuid(),
      email: faker.internet.email(),
      'custom:group': USER_COMMON_GROUPS.ADMIN,
      ...d
    };
  }

  static userAttribute(d?: Partial<AttributeType>): Required<AttributeType> {
    return {
      Name: 'custom:group',
      Value: USER_COMMON_GROUPS.ADMIN,
      ...d
    };
  }

  static adminUserAttribute(d?: Partial<Omit<UserAttributes, 'custom:group'>>) {
    return this.userAttributes({
      'custom:group': USER_COMMON_GROUPS.ADMIN,
      ...d
    });
  }

  static customerUserAttribute(d?: Partial<Omit<UserAttributes, 'custom:group'>>) {
    return this.userAttributes({
      'custom:group': USER_COMMON_GROUPS.CUSTOMER,
      ...d
    });
  }

  static setUserPassword(d?: Partial<SetUserPasswordCognito>): SetUserPasswordCognito {
    return {
      username: faker.internet.userName(),
      password: faker.internet.password(),
      permanent: true,
      ...d
    };
  }

  static user(d?: Partial<User>): User {
    return {
      username: faker.internet.userName(),
      email: faker.internet.email(),
      'custom:group': USER_COMMON_GROUPS.ADMIN,
      sub: faker.string.uuid(),
      enabled: true,
      created_at: faker.date.recent(),
      updated_at: faker.date.recent(),
      status: 'CONFIRMED',
      ...d
    };
  }
}
