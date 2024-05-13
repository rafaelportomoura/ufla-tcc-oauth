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
  ListUsersCommand,
  ListUsersCommandInput,
  NotAuthorizedException,
  UserNotFoundException
} from '@aws-sdk/client-cognito-identity-provider';
import { CognitoJwtVerifier } from 'aws-jwt-verify';
import { CognitoAccessTokenPayload, CognitoJwtPayload } from 'aws-jwt-verify/jwt-model';
import { CreateUser, SetUserPasswordCognito, User, UserAttributes, UserGroup } from '../types/User';
/* eslint-disable no-empty-function */
import { CODE_MESSAGES } from '../constants/codeMessages';
import { BadRequestError } from '../exceptions/BadRequestError';
import { NotFoundError } from '../exceptions/NotFoundError';
import { UnauthorizedError } from '../exceptions/Unauthorized';
import { ConfirmForgotPasswordRequest, LoginRequest } from '../types/Cognito';

export class Cognito {
  private client: CognitoIdentityProviderClient;

  private verifier: ReturnType<typeof CognitoJwtVerifier.create>;

  constructor(
    private pool_id: string,
    private client_id: string,
    scope: string,
    config: CognitoIdentityProviderClientConfig
  ) {
    this.client = new CognitoIdentityProviderClient(config);
    this.verifier = CognitoJwtVerifier.create({
      userPoolId: pool_id,
      tokenUse: 'access',
      clientId: client_id,
      scope
    });
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

  async getUser(username: string): Promise<Required<AdminGetUserResponse>> {
    try {
      const command = new AdminGetUserCommand({
        UserPoolId: this.pool_id,
        Username: username
      });

      return this.client.send(command) as Promise<Required<AdminGetUserResponse>>;
    } catch (error) {
      if (error instanceof UserNotFoundException) throw new NotFoundError(CODE_MESSAGES.USER_NOT_FOUND);
      throw error;
    }
  }

  async login({ username, password }: LoginRequest): Promise<InitiateAuthResponse> {
    try {
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
    } catch (error) {
      if (error instanceof NotAuthorizedException)
        throw new BadRequestError(CODE_MESSAGES.INCORRECT_USERNAME_OR_PASSWORD);
      throw error;
    }
  }

  async forgotPassword(username: string): Promise<ForgotPasswordCommandOutput> {
    const command = new ForgotPasswordCommand({
      ClientId: this.client_id,
      Username: username,
      ClientMetadata: { username }
    });

    return this.client.send(command);
  }

  async confirmForgotPassword(payload: ConfirmForgotPasswordRequest): Promise<ConfirmForgotPasswordCommandOutput> {
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

  async verify<T extends CognitoJwtPayload = CognitoAccessTokenPayload>(jwt: string): Promise<T> {
    try {
      const payload = await this.verifier.verify(jwt);
      return payload as T;
    } catch {
      throw new UnauthorizedError();
    }
  }

  async listUsers({ page, size }: { page: number; size: number }) {
    const command: ListUsersCommandInput = {
      UserPoolId: this.pool_id,
      Limit: size
    };

    for (let i = 0; i < page - 1; i++) {
      command.PaginationToken = (await this.client.send(new ListUsersCommand(command))).PaginationToken;
      if (!command.PaginationToken) throw new NotFoundError(CODE_MESSAGES.PAGE_NOT_FOUND);
    }

    const { Users: users, PaginationToken: next } = await this.client.send(new ListUsersCommand(command));

    return { users: users as User[], next: !!next };
  }
}
