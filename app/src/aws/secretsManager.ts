/* eslint-disable no-empty-function */
/* eslint-disable no-useless-constructor */
import { GetSecretValueCommand, GetSecretValueRequest, SecretsManagerClient } from '@aws-sdk/client-secrets-manager';

import { CONFIGURATION } from '../constants/configuration';

export class SecretsManager {
  constructor(
    private client = new SecretsManagerClient({
      region: CONFIGURATION.REGION
    })
  ) {}

  async getSecret<T = unknown>(secret_path: string): Promise<T> {
    const input: GetSecretValueRequest = {
      SecretId: secret_path
    };

    const command = new GetSecretValueCommand(input);

    const secrets = await this.client.send(command);

    return JSON.parse(secrets.SecretString) as T;
  }
}
