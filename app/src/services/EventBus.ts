/* eslint-disable no-empty-function */
import { FastifyBaseLogger } from 'fastify';
import { SNS } from '../aws/sns';
import { EventBusMessageAttributes } from '../types/EventBus';

export class EventBus {
  constructor(
    private topic: string,
    private logger: FastifyBaseLogger,
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
