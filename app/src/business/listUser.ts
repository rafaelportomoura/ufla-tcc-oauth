import { Cognito } from '../aws/cognito';
import { ListUserParams, ListUserResponse, ListUsersArgs } from '../types/ListUsers';

export class ListUserBusiness {
  private cognito: Cognito;

  constructor({ cognito }: ListUsersArgs) {
    this.cognito = cognito;
  }

  async list({ page, size }: ListUserParams): Promise<ListUserResponse> {
    const response = await this.cognito.listUsers({ page, size });
    return response as ListUserResponse;
  }
}
