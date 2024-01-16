/* eslint-disable no-empty-function */
import { DecryptCommand, DecryptRequest, GetPublicKeyCommand, KMSClient } from '@aws-sdk/client-kms';
import { CONFIGURATION } from '../constants/configuration';
import { ENCRYPTION_ALGORITHM } from '../constants/kms';
import { PubKey } from '../types/Kms';

export class KMS {
  constructor(
    private key_arn: string,
    private client = new KMSClient({ region: CONFIGURATION.REGION })
  ) {}

  async decrypt(value: string): Promise<string> {
    const input: DecryptRequest = {
      CiphertextBlob: Buffer.from(value, 'base64'),
      KeyId: this.key_arn,
      EncryptionAlgorithm: ENCRYPTION_ALGORITHM
    };

    const command = new DecryptCommand(input);

    const response = await this.client.send(command);

    const { Plaintext: plain_text } = response;

    return Buffer.from(plain_text).toString('utf-8');
  }

  async getPubKey(): Promise<PubKey> {
    const input = {
      KeyId: this.key_arn
    };
    const command = new GetPublicKeyCommand(input);
    const response = await this.client.send(command);

    return {
      key_spec: response.KeySpec,
      encryption_algorithm: ENCRYPTION_ALGORITHM,
      public_key: Buffer.from(response.PublicKey).toString('base64')
    };
  }
}
