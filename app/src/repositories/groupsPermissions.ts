import { DynamoDB } from '../aws/dynamodb';
import { AwsConfig } from '../types/Aws';
import { GroupPermissions } from '../types/GroupPermissions';

export class GroupPermissionsRepository {
  private dynamo: DynamoDB;

  constructor(aws_config: AwsConfig) {
    this.dynamo = new DynamoDB(aws_config, 'group_permissions');
  }

  async getPermissions(group: string): Promise<GroupPermissions[]> {
    const items = await this.dynamo.query({
      KeyConditionExpression: 'group = :group',
      ExpressionAttributeValues: { ':group': group }
    });
    return (items.Items as GroupPermissions[]) ?? [];
  }
}
