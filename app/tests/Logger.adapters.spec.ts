/* eslint-disable dot-notation */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { expect } from 'chai';
import Sinon from 'sinon';
import { Logger } from '../src/adapters/logger';
import { CONFIGURATION } from '../src/constants/configuration';
import { LOGGER_LEVEL_MAP } from '../src/constants/logger';
import { LoggerLevel } from '../src/types/Logger';
import { MockLogger } from './mocks/logger';

describe('Test Suit - Logger', () => {
  let console_stub: Sinon.SinonStub;
  beforeEach(() => {
    Sinon.restore();
    console_stub = Sinon.stub(console, 'log').resolves();
    process.env.NODE_ENV = 'dev';
  });

  afterEach(() => {
    process.env.NODE_ENV = 'test';
  });

  for (const [level, { should_log, should_not_log }] of Object.entries(MockLogger.createTestSchema()))
    describe(`When level log is ${level}`, () => {
      const logger = new Logger(undefined, level as LoggerLevel);

      for (const log of should_log)
        it(`Should log with ${log} level`, () => {
          const flush_spy = Sinon.spy(Logger.prototype, <any>'flush');

          logger[log]({ a: 'a' });

          expect(flush_spy.calledOnce).equal(true);
        });
      for (const log of should_not_log)
        it(`Should not log with ${log} level`, () => {
          const flush_spy = Sinon.spy(Logger.prototype, <any>'flush');

          logger[log]('a');

          expect(flush_spy.calledOnce).equal(false);
        });
    });

  it('Should not set default level and set tracing', () => {
    const logger = new Logger('id');

    logger.log({ a: 'a' }, 'a');

    expect(console_stub.args[0]).deep.equal(['{"tracing_id":"id"}', '|', '{"a":"a"}', 'a']);
    expect(logger['tracing_id']).equal('id');
    expect(logger['level']).equal(LOGGER_LEVEL_MAP[CONFIGURATION.LOG_LEVEL]);
  });

  it('Should not stringify circular object', () => {
    const logger = new Logger('id');

    const obj: Record<string, unknown> = { self: null };
    obj.self = obj;
    logger.log(obj);

    expect(console_stub.args[0]).deep.equal(['{"tracing_id":"id"}', '|', obj]);
    expect(logger['tracing_id']).equal('id');
    expect(logger['level']).equal(LOGGER_LEVEL_MAP[CONFIGURATION.LOG_LEVEL]);
  });
});
