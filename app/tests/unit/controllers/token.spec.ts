import { expect } from 'chai';
import Sinon from 'sinon';
import { ValidateToken } from '../../../src/business/validateToken';
import { validateTokenController } from '../../../src/controllers/token';
import { ValidationError } from '../../../src/exceptions/ValidationError';
import { fastify_reply, fastify_request } from '../../data/fastify';

describe('Controller -> Login', async () => {
  beforeEach(Sinon.restore);
  const res = fastify_reply();
  it('Should validate token', async () => {
    const status_spy = Sinon.spy(res, 'status');
    const req = fastify_request({ body: { token: '1' } });
    Sinon.stub(ValidateToken.prototype, 'authorize').resolves();
    const response = await validateTokenController(req, res);
    expect(status_spy.args).deep.eq([[200]]);
    expect(response).to.deep.equal(undefined);
  });
  it('Should not validate token', async () => {
    const status_spy = Sinon.spy(res, 'status');
    const req = fastify_request();
    const response = await validateTokenController(req, res);
    expect(status_spy.args).deep.eq([[400]]);
    expect(response).instanceOf(ValidationError);
  });
});
