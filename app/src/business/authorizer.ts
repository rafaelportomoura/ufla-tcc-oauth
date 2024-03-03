/* eslint-disable no-empty-function */
import { match } from 'path-to-regexp';
import { USER_COMMON_GROUPS } from '../constants/groups';
import { ForbiddenError } from '../exceptions/ForbiddenError';
import { GroupPermissionsRepository } from '../repositories/groupsPermissions';
import { Authorizer, AuthorizerArgs, AuthorizerResponse } from '../types/Authorizer';
import { GroupPermissions } from '../types/GroupPermissions';
import { Logger } from '../types/Logger';
import { GetUserBusiness } from './getUser';
import { ValidateToken } from './validateToken';

export class AuthorizerBusiness {
  private get_user: GetUserBusiness;

  private group_permissions: GroupPermissionsRepository;

  private validate_token: ValidateToken;

  private logger: Logger;

  constructor({ pool_id, client_id, aws_config, cognito_issuer, logger }: AuthorizerArgs) {
    this.get_user = new GetUserBusiness(pool_id, client_id, aws_config);
    this.group_permissions = new GroupPermissionsRepository(aws_config);
    this.validate_token = ValidateToken.creator({ cognito_issuer });
    this.logger = logger;
  }

  async authorize({ authorization, arn, path_parameters }: Authorizer): Promise<AuthorizerResponse> {
    this.logger.debug({ authorization, arn, path_parameters }, 'AuthorizerBusiness.authorize body');
    const decoded = await this.validate_token.verify(authorization);

    this.logger.debug(decoded, 'AuthorizerBusiness.authorize decoded');
    const { username } = decoded;

    const permissions = await this.getGroupPermissions(username);

    this.logger.debug(permissions, 'AuthorizerBusiness.authorize permissions');

    if (permissions.some(({ group }) => group === USER_COMMON_GROUPS.ADMIN)) return this.authorized(username);

    const path = arn.replace(/arn:aws:execute-api:[\w-]+:\d+:/g, '');

    for (const group_permission of permissions) {
      const allowed = this.pathAllowed(group_permission, path, path_parameters);
      if (allowed) return this.authorized(username);
    }

    return this.unauthorized(username);
  }

  async getGroupPermissions(username: string): Promise<GroupPermissions[]> {
    const { 'custom:group': group } = await this.get_user.getUser(username);

    const permissions = await this.group_permissions.getPermissions(group);

    return permissions;
  }

  pathAllowed(
    { permission, same_user }: GroupPermissions,
    path: string,
    path_parameters: Authorizer['path_parameters']
  ): boolean {
    const permission_match = match(permission);

    const match_response = permission_match(path);
    this.logger.debug(match_response, `AuthorizerBusiness.pathAllowed match_response ${permission}`);
    if (!match_response) return false;

    if (!same_user) return true;

    const is_same_user = path_parameters.username === (match_response.params as Record<string, string>).username;

    if (!is_same_user) throw new ForbiddenError();

    return true;
  }

  authorized(username: string): AuthorizerResponse {
    return { is_authorized: true, context: { username } };
  }

  unauthorized(username: string): AuthorizerResponse {
    return { is_authorized: false, context: { username } };
  }
}
