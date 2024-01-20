/* eslint-disable no-empty-function */
import { FastifyBaseLogger } from 'fastify/types/logger';
import { DynamoDB } from '../aws/dynamodb';
import { Example } from '../types/Example';

export class GroupRepository {
  private db: DynamoDB;

  constructor(private logger: FastifyBaseLogger) {
    this.db = new DynamoDB('example');
  }

  async getExample(id: string): Promise<Example> {
    this.logger.debug(`ExampleRepository.get(${id})`);
    const response = await this.db.get({
      Key: { id }
    });
    return response.Item as Example;
  }
}
