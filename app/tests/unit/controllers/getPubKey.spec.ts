import { expect } from 'chai';
import Sinon from 'sinon';
import { GetPubKey } from '../../../src/business/getPubKey';
import { getPubKey } from '../../../src/controllers/getPubKey';
import { InternalServerError } from '../../../src/exceptions/InternalServerError';
import { fastify_reply, fastify_request } from '../../data/fastify';

describe('Controller -> GetPubKey', async () => {
  beforeEach(Sinon.restore);
  const res = fastify_reply();
  it('Should get pub key', async () => {
    const status_spy = Sinon.spy(res, 'status');
    Sinon.stub(GetPubKey.prototype, 'get').resolves({
      public_key: 'pubKey',
      encryption_algorithm: 'RSA',
      key_spec: '2048'
    });
    const response = await getPubKey(fastify_request(), res);
    expect(status_spy.args).deep.eq([[200]]);
    expect(response).to.deep.equal({
      public_key: 'pubKey',
      encryption_algorithm: 'RSA',
      key_spec: '2048'
    });
  });
  it('Should not get pub key', async () => {
    const status_spy = Sinon.spy(res, 'status');
    Sinon.stub(GetPubKey.prototype, 'get').rejects();
    const response = await getPubKey(fastify_request(), res);
    expect(status_spy.args).deep.eq([[500]]);
    expect(response).instanceOf(InternalServerError);
  });
});
