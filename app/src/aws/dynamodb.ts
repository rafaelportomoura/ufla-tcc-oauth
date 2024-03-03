import { DynamoDBClient, DynamoDBClientConfig } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, QueryCommand, QueryCommandInput, QueryCommandOutput } from '@aws-sdk/lib-dynamodb';

export class DynamoDB {
  private client: DynamoDBDocumentClient;

  constructor(
    config: DynamoDBClientConfig,
    protected table: string
  ) {
    this.client = DynamoDBDocumentClient.from(new DynamoDBClient(config));
  }

  query(input: Omit<QueryCommandInput, 'TableName'>): Promise<QueryCommandOutput> {
    const command = new QueryCommand({ TableName: this.table, ...input });

    return this.client.send(command);
  }
}
