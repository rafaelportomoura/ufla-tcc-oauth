/* eslint-disable no-empty-function */
import { CognitoAccessTokenPayload } from 'aws-jwt-verify/jwt-model';
import { pathToRegexp } from 'path-to-regexp';
import { Cognito } from '../aws/cognito';
import { USER_COMMON_GROUPS } from '../constants/groups';
import { BaseError } from '../exceptions/BaseError';
import { ForbiddenError } from '../exceptions/ForbiddenError';
import { UnauthorizedError } from '../exceptions/Unauthorized';
import { AuthorizerArgs } from '../types/Authorizer';

export class Authorizer {
  private cognito: Cognito;

  constructor(args: AuthorizerArgs) {
    this.cognito = args.cognito;
  }

  async authorize(token: string, method_arn: string): Promise<CognitoAccessTokenPayload> {
    try {
      const decoded_token = await this.cognito.verify<CognitoAccessTokenPayload>(token);
      const { username } = decoded_token;
      const user = await this.cognito.getUser(username);
      const group = this.cognito.getGroup(user.UserAttributes);

      if (group !== USER_COMMON_GROUPS.ADMIN) {
        await this.validate(method_arn, decoded_token);
      }

      return decoded_token;
    } catch (error) {
      throw error instanceof BaseError ? error : new UnauthorizedError();
    }
  }

  async validate(method_arn: string, decoded_token: CognitoAccessTokenPayload): Promise<void> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [_, __, method, ...path] = method_arn.split('/');
    const method_path = [method, ...path].join('/');

    if (pathToRegexp('GET/keys/pub-key').test(method_path)) return;

    if (pathToRegexp(`GET/users/${encodeURIComponent(decoded_token.username)}`).test(method_path)) return;

    if (pathToRegexp('POST/users/admins').test(method_path)) throw new ForbiddenError(decoded_token);

    if (pathToRegexp('POST/users/admins/force').test(method_path)) throw new ForbiddenError(decoded_token);

    if (pathToRegexp('POST/users/customers').test(method_path)) return;

    throw new ForbiddenError(decoded_token);
  }
}
