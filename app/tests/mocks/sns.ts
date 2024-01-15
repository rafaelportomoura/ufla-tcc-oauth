import { PublishCommandInput } from '@aws-sdk/client-sns';
import { CONFIGURATION } from '../../src/constants/configuration';
import { EventBusMessageAttributes } from '../../src/types/EventBus';

export class MockSns {
  static pub(
    message: unknown,
    message_attributes: EventBusMessageAttributes,
    topic: string = CONFIGURATION.EVENT_BUS
  ): PublishCommandInput {
    return {
      TopicArn: topic,
      Message: JSON.stringify(message),
      MessageAttributes: message_attributes
    };
  }
}
