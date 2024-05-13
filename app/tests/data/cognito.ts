import { AdminGetUserResponse, UserType } from '@aws-sdk/client-cognito-identity-provider';
import { Cognito } from '../../src/aws/cognito';

export class CognitoData {
  static default(): Cognito {
    return new Cognito('us-east-2_334NEqSbZ', '601r8kvmslt416fv8829shkiai', 'scope', {});
  }

  static user(username: string, group: string): Required<UserType & AdminGetUserResponse> {
    return {
      Username: username,
      UserAttributes: [
        { Name: 'sub', Value: 'sub' },
        { Name: 'email', Value: 'email' },
        { Name: 'custom:group', Value: group }
      ]
    } as Required<AdminGetUserResponse & UserType>;
  }

  static userType(username: string, group: string): Required<UserType> {
    return {
      Username: username,
      Attributes: [
        { Name: 'sub', Value: 'sub' },
        { Name: 'email', Value: 'email' },
        { Name: 'custom:group', Value: group }
      ]
    } as Required<UserType>;
  }
}
