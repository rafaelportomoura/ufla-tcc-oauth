/* eslint-disable no-empty-function */
import { KMS } from '../aws/kms';
import { PubKey } from '../types/Kms';

export class GetPubKey {
  constructor(private kms = new KMS()) {}

  get(): Promise<PubKey> {
    return this.kms.getPubKey();
  }
}
