import {
  AdminCreateUserCommand,
  AdminCreateUserRequest,
  AdminCreateUserResponse,
  AdminGetUserCommand,
  AdminGetUserResponse,
  AdminSetUserPasswordCommand,
  AdminSetUserPasswordRequest,
  AdminSetUserPasswordResponse,
  AttributeType,
  CognitoIdentityProviderClient,
  CognitoIdentityProviderClientConfig,
  ConfirmForgotPasswordCommand,
  ConfirmForgotPasswordCommandOutput,
  ForgotPasswordCommand,
  ForgotPasswordCommandOutput,
  InitiateAuthCommand,
  InitiateAuthRequest,
  InitiateAuthResponse,
  VerifySoftwareTokenCommand
} from '@aws-sdk/client-cognito-identity-provider';
import { CreateUser, SetUserPasswordCognito, UserAttributes, UserGroup } from '../types/User';
/* eslint-disable no-empty-function */
import { ConfirmForgotPassword } from '../types/ForgotPassword';
import { Login } from '../types/Login';

export class Cognito {
  private client: CognitoIdentityProviderClient;

  constructor(
    private pool_id: string,
    private client_id: string,
    config: CognitoIdentityProviderClientConfig
  ) {
    this.client = new CognitoIdentityProviderClient(config);
  }

  createUser(payload: CreateUser, group: UserGroup): Promise<AdminCreateUserResponse> {
    const input: AdminCreateUserRequest = {
      Username: payload.username,
      UserAttributes: [
        {
          Name: 'email',
          Value: payload.email
        },
        {
          Name: 'custom:group',
          Value: group
        }
      ],
      ClientMetadata: {
        username: payload.username,
        email: payload.email,
        group
      },
      MessageAction: 'SUPPRESS',
      UserPoolId: this.pool_id
    };

    const command = new AdminCreateUserCommand(input);

    return this.client.send(command);
  }

  setUserPassword(payload: SetUserPasswordCognito): Promise<AdminSetUserPasswordResponse> {
    const input: AdminSetUserPasswordRequest = {
      Username: payload.username,
      Password: payload.password,
      Permanent: payload.permanent,
      UserPoolId: this.pool_id
    };

    const command = new AdminSetUserPasswordCommand(input);

    return this.client.send(command);
  }

  getUser(username: string): Promise<Required<AdminGetUserResponse>> {
    const command = new AdminGetUserCommand({
      UserPoolId: this.pool_id,
      Username: username
    });

    return this.client.send(command) as Promise<Required<AdminGetUserResponse>>;
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

  getGroup(user_attributes: AttributeType[]): string {
    return user_attributes.find((v) => v.Name === 'custom:group')?.Value as string;
  }

  mapAttributes(user_attributes: Required<AttributeType>[]): UserAttributes {
    const attributes = {} as UserAttributes;

    for (const v of user_attributes) attributes[v.Name as keyof UserAttributes] = v.Value;

    return attributes;
  }

  async validateToken() {
    const command = new VerifySoftwareTokenCommand();
  }
}
