/* eslint-disable no-empty-function */
import { jwtDecode } from 'jwt-decode';
import { Cognito } from '../aws/cognito';
import { USER_COMMON_GROUPS } from '../constants/groups';
import { Authorizer, AuthorizerResponse, DecodedToken } from '../types/Authorizer';

export class AuthorizerBusiness {
  constructor(private cognito = new Cognito()) {}

  async authorize(payload: Authorizer): Promise<AuthorizerResponse> {
    const decoded = this.decodeToken(payload.authorization);

    const { username } = decoded;

    const is_endpoint_at_all_users_group = await this.verifyAllUsersGroup();

    if (is_endpoint_at_all_users_group) return { is_authorized: true };

    const user = await this.cognito.getUser(username);

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
