/* eslint-disable no-empty-function */
import { Logger } from '../adapters/logger';
import { DynamoDB } from '../aws/dynamodb';
import { Example } from '../types/Example';

export class ExampleRepository {
  constructor(
    private logger = new Logger(),
    private db = new DynamoDB('example')
  ) {}

  setLogger(logger: Logger) {
    this.logger = logger;
  }

  async getExample(id: string): Promise<Example> {
    this.logger.debug(`ExampleRepository.get(${id})`);
    const response = await this.db.get({
      Key: { id }
    });
    return response.Item as Example;
  }
}
