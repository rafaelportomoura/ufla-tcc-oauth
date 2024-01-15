/* eslint-disable no-empty-function */
import { GetParameterCommand, GetParameterRequest, SSMClient } from '@aws-sdk/client-ssm';
import { CONFIGURATION } from '../constants/configuration';

export class SSM {
  constructor(private client = new SSMClient({ region: CONFIGURATION.REGION })) {}

  async getParams<T>(parameter_name: string, with_decryption = false): Promise<T> {
    const input: GetParameterRequest = { Name: parameter_name, WithDecryption: with_decryption };

    const command = new GetParameterCommand(input);

    const response = await this.client.send(command);

    const value = JSON.parse(response.Parameter.Value);

    return value as T;
  }
}
