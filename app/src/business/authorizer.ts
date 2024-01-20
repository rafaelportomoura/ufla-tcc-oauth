/* eslint-disable no-empty-function */
import { jwtDecode } from 'jwt-decode';
import { isEmpty } from 'lodash';
import { Cognito } from '../aws/cognito';
import { CODE_MESSAGES } from '../constants/codeMessages';
import { USER_COMMON_GROUPS } from '../constants/groups';
import { ForbiddenError } from '../exceptions/ForbiddenError';
import { NotFoundError } from '../exceptions/NotFoundError';
import { Authorizer, AuthorizerResponse, DecodedToken } from '../types/Authorizer';
import { AwsConfig } from '../types/Aws';

export class AuthorizerBusiness {
  private cognito: Cognito;

  constructor(pool_id: string, client_id: string, config: AwsConfig) {
    this.cognito = new Cognito(pool_id, client_id, config);
  }

  async authorize(payload: Authorizer): Promise<AuthorizerResponse> {
    const decoded = this.decodeToken(payload.authorization);

    const { username } = decoded;

    const is_endpoint_at_all_users_group = await this.verifyAllUsersGroup();

    if (is_endpoint_at_all_users_group) return { is_authorized: true };

    const user = await this.cognito.getUser(username);

    if (!user) throw new NotFoundError(CODE_MESSAGES.NOT_FOUND_ERROR);

    if (!user.UserAttributes || isEmpty(user.UserAttributes)) throw new ForbiddenError();

    const group = this.cognito.getGroup(user.UserAttributes);

    if (group === USER_COMMON_GROUPS.ADMIN) return { is_authorized: true, context: { username } };

    return { is_authorized: false, context: { username } };
  }

  decodeToken(authorization: string): DecodedToken {
    const decoded = jwtDecode<DecodedToken>(authorization);

    return decoded;
  }

  async verifyAllUsersGroup(): Promise<boolean> {
    return false;
  }
}
