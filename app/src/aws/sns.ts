/* eslint-disable no-empty-function */
import { PublishCommand, PublishCommandInput, PublishCommandOutput, SNSClient } from '@aws-sdk/client-sns';
import { CONFIGURATION } from '../constants/configuration';

export class SNS {
  constructor(private client = new SNSClient({ region: CONFIGURATION.REGION })) {}

  async pub(input: PublishCommandInput): Promise<PublishCommandOutput> {
    const command = new PublishCommand(input);

    return this.client.send(command);
  }
}
