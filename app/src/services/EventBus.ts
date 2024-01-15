/* eslint-disable no-empty-function */
import { Logger } from '../adapters/logger';
import { SNS } from '../aws/sns';
import { CONFIGURATION } from '../constants/configuration';
import { EventBusMessageAttributes } from '../types/EventBus';

export class EventBus {
  constructor(
    private topic = CONFIGURATION.EVENT_BUS,
    private logger = new Logger(),
    private sns = new SNS()
  ) {}

  async pub(body: unknown, message_attributes: EventBusMessageAttributes): Promise<void> {
    this.logger.debug('EventBus.publish(', body, message_attributes, ')');

    const response = await this.sns.pub({
      TopicArn: this.topic,
      Message: JSON.stringify(body),
      MessageAttributes: message_attributes
    });

    this.logger.debug('EventBus.publish ->', response);
  }
}
