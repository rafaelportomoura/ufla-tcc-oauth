import { CognitoAccessTokenPayload } from 'aws-jwt-verify/jwt-model';
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
}
