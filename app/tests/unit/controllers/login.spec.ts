import { expect } from 'chai';
import Sinon from 'sinon';
import { LoginBusiness } from '../../../src/business/login';
import { login } from '../../../src/controllers/login';
import { ValidationError } from '../../../src/exceptions/ValidationError';
import { fastify_reply, fastify_request } from '../../data/fastify';

describe('Controller -> Login', async () => {
  beforeEach(Sinon.restore);
  const res = fastify_reply();
  it('Should login', async () => {
    const status_spy = Sinon.spy(res, 'status');
    const req = fastify_request({ body: { username: '1', password: '2' } });
    Sinon.stub(LoginBusiness.prototype, 'login').resolves();
    const response = await login(req, res);
    expect(status_spy.args).deep.eq([[201]]);
    expect(response).to.deep.equal(undefined);
  });
  it('Should not login', async () => {
    const status_spy = Sinon.spy(res, 'status');
    const req = fastify_request();
    const response = await login(req, res);
    expect(status_spy.args).deep.eq([[400]]);
    expect(response).instanceOf(ValidationError);
  });
});
