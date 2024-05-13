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
});
