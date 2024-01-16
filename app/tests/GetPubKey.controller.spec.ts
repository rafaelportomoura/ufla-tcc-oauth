import { expect } from 'chai';
import Sinon from 'sinon';
import { GetPubKey } from '../src/business/getPubKey';
import { getPubKey } from '../src/controllers/getPubKey';
import { MockExpress } from './mocks/express';
import { MockPubKey } from './mocks/pub_key';

describe('Test Suit - Get Pub Key Controller', async () => {
  beforeEach(() => Sinon.restore());

  it('Should get pub key', async () => {
    const business_stub = Sinon.stub(GetPubKey.prototype, 'get').resolves(MockPubKey.pubkey());

    await getPubKey(MockExpress.request(), MockExpress.response(), MockExpress.next());

    expect(business_stub.calledOnce).equal(true);
  });

  it('Should get pub key', async () => {
    const business_stub = Sinon.stub(GetPubKey.prototype, 'get').throws(new Error('x'));

    try {
      await getPubKey(MockExpress.request(), MockExpress.response(), MockExpress.next());
    } catch (error) {
      expect(error).deep.equal(new Error('x'));
      expect(business_stub.calledOnce).equal(true);
    }
  });
});
