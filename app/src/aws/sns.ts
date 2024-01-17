/* eslint-disable no-empty-function */
import { PublishCommand, PublishCommandInput, PublishCommandOutput, SNSClient } from '@aws-sdk/client-sns';
import { AWS_CONFIGURATION } from '../constants/aws';

export class SNS {
  constructor(private client = new SNSClient(AWS_CONFIGURATION)) {}

  async pub(input: PublishCommandInput): Promise<PublishCommandOutput> {
    const command = new PublishCommand(input);

    return this.client.send(command);
  }
}
