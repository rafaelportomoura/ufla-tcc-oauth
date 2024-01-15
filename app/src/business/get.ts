import { Logger } from '../adapters/logger';
/* eslint-disable no-empty-function */
import { ExampleRepository } from '../repositories/exampleRepository';
import { Example } from '../types/Example';

export class GetBusiness {
  constructor(
    private logger = new Logger('GetBusiness'),
    private repository = new ExampleRepository()
  ) {
    this.repository.setLogger(logger);
  }

  setLogger(logger: Logger): void {
    this.logger = logger;
    this.repository.setLogger(logger);
  }

  async get(): Promise<Example> {
    this.logger.debug('GetBusiness.get()');
    return this.repository.getExample('id');
  }
}
