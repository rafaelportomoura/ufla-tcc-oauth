import { LoggerLevel } from '../../src/types/Logger';

type LoggerTestSchema = {
  [key in LoggerLevel]: { should_log: LoggerLevel[]; should_not_log: LoggerLevel[] };
};

export class MockLogger {
  static createTestSchema(): LoggerTestSchema {
    return {
      error: {
        should_log: ['error'],
        should_not_log: ['warn', 'log', 'info', 'verbose', 'debug']
      },
      warn: {
        should_log: ['error', 'warn'],
        should_not_log: ['log', 'info', 'verbose', 'debug']
      },
      log: {
        should_log: ['error', 'warn', 'log'],
        should_not_log: ['info', 'verbose', 'debug']
      },
      info: {
        should_log: ['error', 'warn', 'log', 'info'],
        should_not_log: ['verbose', 'debug']
      },
      verbose: {
        should_log: ['error', 'warn', 'log', 'info', 'verbose'],
        should_not_log: ['debug']
      },
      debug: {
        should_log: ['error', 'warn', 'log', 'info', 'verbose', 'debug'],
        should_not_log: []
      }
    };
  }
}
