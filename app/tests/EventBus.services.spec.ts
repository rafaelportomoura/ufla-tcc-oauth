import { expect } from 'chai';
import Sinon from 'sinon';
import { Logger } from '../src/adapters/logger';
import { SNS } from '../src/aws/sns';
import { EventBus } from '../src/services/EventBus';
import { MockEventBus } from './mocks/event_bus';
import { MockSns } from './mocks/sns';

describe('Test Suit - Event Bus', async () => {
  beforeEach(() => Sinon.restore());

  it('Should publish', async () => {
    const sns_stub = Sinon.stub(SNS.prototype, 'pub').resolves();
    const logger_debug_spy = Sinon.spy(Logger.prototype, 'debug');

    const mock_body = { test: true };
    const message_attribute = MockEventBus.success();

    await new EventBus().pub(mock_body, message_attribute);

    expect(logger_debug_spy.callCount).equal(2);
    expect(logger_debug_spy.args[0]).deep.equal(['EventBus.publish(', mock_body, message_attribute, ')']);
    expect(logger_debug_spy.args[1]).deep.equal(['EventBus.publish ->', undefined]);
    expect(sns_stub.args[0]).deep.equal([MockSns.pub(mock_body, message_attribute)]);
  });
});
