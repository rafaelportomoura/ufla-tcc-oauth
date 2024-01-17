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
  ConfirmForgotPasswordCommand,
  ConfirmForgotPasswordCommandOutput,
  ForgotPasswordCommand,
  ForgotPasswordCommandOutput,
  InitiateAuthCommand,
  InitiateAuthRequest,
  InitiateAuthResponse
} from '@aws-sdk/client-cognito-identity-provider';
import { AWS_CONFIGURATION } from '../constants/aws';
import { CONFIGURATION } from '../constants/configuration';
import { Login } from '../types/Login';
import { ConfirmForgotPassword, CreateUser, SetUserPassword } from '../types/User';

export class Cognito {
  constructor(
    private pool_id = CONFIGURATION.COGNITO_USER_POLL,
    private client_id = CONFIGURATION.COGNITO_CLIENT_ID,
    private client = new CognitoIdentityProviderClient(AWS_CONFIGURATION)
  ) {}

  createUser(payload: CreateUser): Promise<AdminCreateUserResponse> {
    const input: AdminCreateUserRequest = {
      ...payload,
      MessageAction: 'SUPPRESS',
      UserPoolId: this.pool_id
    };

    const command = new AdminCreateUserCommand(input);

    return this.client.send(command);
  }

  setUserPassword(payload: SetUserPassword): Promise<AdminSetUserPasswordResponse> {
    const input: AdminSetUserPasswordRequest = {
      ...payload,
      UserPoolId: this.pool_id
    };

    const command = new AdminCreateUserCommand(input);

    return this.client.send(command);
  }

  getUser(username: string): Promise<AdminGetUserResponse> {
    const command = new AdminGetUserCommand({
      UserPoolId: this.pool_id,
      Username: username
    });

    return this.client.send(command);
  }

  login({ username, password }: Login): Promise<InitiateAuthResponse> {
    const input: InitiateAuthRequest = {
      AuthFlow: 'USER_PASSWORD_AUTH',
      ClientId: this.client_id,
      AuthParameters: {
        USERNAME: username,
        PASSWORD: password
      }
    };

    const command = new InitiateAuthCommand(input);

    return this.client.send(command);
  }

  forgotPassword(username: string): Promise<ForgotPasswordCommandOutput> {
    const command = new ForgotPasswordCommand({
      ClientId: this.client_id,
      Username: username,
      ClientMetadata: { username }
    });

    return this.client.send(command);
  }

  confirmForgotPassword(payload: ConfirmForgotPassword): Promise<ConfirmForgotPasswordCommandOutput> {
    const command = new ConfirmForgotPasswordCommand({
      ClientId: this.client_id,
      Username: payload.username,
      Password: payload.password,
      ConfirmationCode: payload.confirmation_code,
      ClientMetadata: {
        username: payload.username
      }
    });

    return this.client.send(command);
  }
}
