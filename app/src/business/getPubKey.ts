/* eslint-disable no-empty-function */
import { KMS } from '../aws/kms';
import { CONFIGURATION } from '../constants/configuration';
import { PubKey } from '../types/Kms';

export class GetPubKey {
  constructor(private kms = new KMS(CONFIGURATION.KEY_ARN)) {}

  get(): Promise<PubKey> {
    return this.kms.getPubKey();
  }
}
