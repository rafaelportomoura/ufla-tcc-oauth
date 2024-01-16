import { ENCRYPTION_ALGORITHM } from '../../src/constants/kms';
import { PubKey } from '../../src/types/Kms';

export class MockPubKey {
  static pubkey(): PubKey {
    return {
      encryption_algorithm: ENCRYPTION_ALGORITHM,
      key_spec: 'RSA_2048',
      public_key: 'x'
    };
  }
}
