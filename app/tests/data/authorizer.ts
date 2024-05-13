/* eslint-disable import/no-extraneous-dependencies */
import { faker } from '@faker-js/faker';
import { CognitoAccessTokenPayload } from 'aws-jwt-verify/jwt-model';
import { ConfirmForgotPasswordRequest, LoginRequest } from '../../src/types/Cognito';
import { UsersData } from './users';

export class AuthorizerData {
  static methodArn(method: string, path: string): string {
    return `arn:aws:execute-api:us-east-1:123456789012:api-id/dev/${method}/${path}`;
  }

  static pubKeyArn(): string {
    return AuthorizerData.methodArn('GET', 'keys/pub-key');
  }

  static getUser(username: string = UsersData.username()): string {
    return AuthorizerData.methodArn('GET', `users/${encodeURIComponent(username)}`);
  }

  static createAdmin(): string {
    return AuthorizerData.methodArn('POST', 'users/admins');
  }

  static forceAdmin(): string {
    return AuthorizerData.methodArn('POST', 'users/admins/force');
  }

  static createCustomer(): string {
    return AuthorizerData.methodArn('POST', 'users/customers');
  }

  static allArns(username: string = UsersData.username()): string[] {
    return [
      AuthorizerData.pubKeyArn(),
      AuthorizerData.getUser(username),
      AuthorizerData.createAdmin(),
      AuthorizerData.forceAdmin(),
      AuthorizerData.createCustomer()
    ];
  }

  static decodedToken(username: string): CognitoAccessTokenPayload {
    return {
      username,
      sub: 'sub',
      iss: 'https://cognito-idp.us-east-1.amazonaws.com/us-east-1_334NEqSbZ',
      token_use: 'access',
      auth_time: 1633344000,
      exp: 1633347600,
      iat: 1633344000,
      jti: 'jti',
      client_id: '601r8kvmslt416fv8829shkiai',
      scope: 'scope',
      origin_jti: 'origin_jti',
      event_id: 'event_id',
      version: 2
    };
  }

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

  static policyDocument(effect: string, sub: string, arn: string) {
    return {
      principalId: sub,
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: effect,
            Resource: arn
          }
        ]
      }
    };
  }

  static denyPolicyDocument(sub: string, arn: string): unknown {
    return this.policyDocument('Deny', sub, arn);
  }

  static allowPolicyDocument(username: string, sub: string, arn: string): unknown {
    return { ...this.policyDocument('Allow', sub, arn), context: { headers: JSON.stringify({ username }) } };
  }
}
