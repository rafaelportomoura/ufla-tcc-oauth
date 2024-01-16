import { expect } from 'chai';
import Sinon from 'sinon';
import { KMS } from '../src/aws/kms';
import { GetPubKey } from '../src/business/getPubKey';
import { MockPubKey } from './mocks/pub_key';

describe('Test Suit - Get Pub Key Business', async () => {
  beforeEach(() => Sinon.restore());

  it('Should get pub key', async () => {
    const key_stub = Sinon.stub(KMS.prototype, 'getPubKey').resolves(MockPubKey.pubkey());

    const response = await new GetPubKey().get();

    expect(response).deep.equal(MockPubKey.pubkey());
    expect(key_stub.calledOnce).equal(true);
  });
});
