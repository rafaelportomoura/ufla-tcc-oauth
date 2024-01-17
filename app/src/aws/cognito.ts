/* eslint-disable no-empty-function */
import {
  AdminCreateUserCommand,
  AdminCreateUserRequest,
  AdminCreateUserResponse,
  AdminGetUserCommand,
  AdminGetUserResponse,
  AdminSetUserPasswordRequest,
  AdminSetUserPasswordResponse,
  CognitoIdentityProviderClient,
  InitiateAuthCommand,
  InitiateAuthRequest,
  InitiateAuthResponse
} from '@aws-sdk/client-cognito-identity-provider';
import { AWS_CONFIGURATION } from '../constants/aws';
import { CONFIGURATION } from '../constants/configuration';
import { Login } from '../types/Login';
import { CreateUser, SetUserPassword } from '../types/User';

export class Cognito {
  constructor(
    private user_pool_id = CONFIGURATION.COGNITO_USER_POLL,
    private user_client_id = CONFIGURATION.COGNITO_CLIENT_ID,
    private client = new CognitoIdentityProviderClient(AWS_CONFIGURATION)
  ) {}

  createUser(payload: CreateUser): Promise<AdminCreateUserResponse> {
    const input: AdminCreateUserRequest = {
      ...payload,
      MessageAction: 'SUPPRESS',
      UserPoolId: this.user_pool_id
    };

    const command = new AdminCreateUserCommand(input);

    return this.client.send(command);
  }

  setUserPassword(payload: SetUserPassword): Promise<AdminSetUserPasswordResponse> {
    const input: AdminSetUserPasswordRequest = {
      ...payload,
      UserPoolId: this.user_pool_id
    };

    const command = new AdminCreateUserCommand(input);

    return this.client.send(command);
  }

  getUser(username: string): Promise<AdminGetUserResponse> {
    const command = new AdminGetUserCommand({
      UserPoolId: this.user_pool_id,
      Username: username
    });

    return this.client.send(command);
  }

  login({ username, password }: Login): Promise<InitiateAuthResponse> {
    const input: InitiateAuthRequest = {
      AuthFlow: 'USER_PASSWORD_AUTH',
      ClientId: this.user_client_id,
      AuthParameters: {
        USERNAME: username,
        PASSWORD: password
      }
    };

    const command = new InitiateAuthCommand(input);

    return this.client.send(command);
  }
}
