import { MessageAttributeValue } from '@aws-sdk/client-sns';

export type EventBusMessageAttributes = {
  [key: string]: MessageAttributeValue;

  event: MessageAttributeValue;

  type: MessageAttributeValue;

  status: MessageAttributeValue;
};
