/* eslint-disable dot-notation */
import { InvalidCiphertextException } from '@aws-sdk/client-kms';
import { expect } from 'chai';
import Sinon from 'sinon';
import { KMS } from '../../../src/aws/kms';
import { BadRequestError } from '../../../src/exceptions/BadRequestError';

describe('AWS -> KMS', () => {
  beforeEach(Sinon.restore);
  it('Should decrypt a value', async () => {
    const value = 'encryptedValue';
    const kms = new KMS('key_arn', {});
    Sinon.stub(kms['client'], 'send').resolves({
      Plaintext: Buffer.from('decryptedValue')
    });
    const response = await kms.decrypt(value);
    expect(response).eq('decryptedValue');
  });
  it('Should throw bad request when decrypt', async () => {
    const value = 'encryptedValue';
    const kms = new KMS('key_arn', {});
    Sinon.stub(kms['client'], 'send').throws(new InvalidCiphertextException({ message: '', $metadata: {} }));
    const response = await kms.decrypt(value).catch((e) => e);
    expect(response).instanceof(BadRequestError);
  });
  it('Should throw error when decrypt', async () => {
    const value = 'encryptedValue';
    const kms = new KMS('key_arn', {});
    Sinon.stub(kms['client'], 'send').throws(new Error());
    const response = await kms.decrypt(value).catch((e) => e);
    expect(response).not.instanceof(BadRequestError);
  });
  it('Should get public key', async () => {
    const value = 'encryptedValue';
    const kms = new KMS('key_arn', {});
    Sinon.stub(kms['client'], 'send').resolves({
      KeySpec: 'RSA_2048',
      PublicKey: Buffer.from('publicKey')
    });
    const response = await kms.getPubKey();
    expect(response).deep.eq({
      key_spec: 'RSA_2048',
      encryption_algorithm: 'RSAES_OAEP_SHA_256',
      public_key: 'cHVibGljS2V5'
    });
  });
});
