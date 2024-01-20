/* eslint-disable no-empty-function */
import { KMS } from '../aws/kms';
import { AwsConfig } from '../types/Aws';
import { PubKey } from '../types/Kms';

export class GetPubKey {
  private kms: KMS;

  constructor(key_arn: string, config: AwsConfig) {
    this.kms = new KMS(key_arn, config);
  }

  get(): Promise<PubKey> {
    return this.kms.getPubKey();
  }
}
