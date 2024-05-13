import { expect } from 'chai';
import Sinon from 'sinon';
import { GetUserBusiness } from '../../../src/business/getUser';
import { getUser } from '../../../src/controllers/getUser';
import { ValidationError } from '../../../src/exceptions/ValidationError';
import { fastify_reply, fastify_request } from '../../data/fastify';
import { UsersData } from '../../data/users';

describe('Controller -> GetUser', async () => {
  beforeEach(Sinon.restore);
  const res = fastify_reply();
  it('Should get pub key', async () => {
    const status_spy = Sinon.spy(res, 'status');
    const user = UsersData.user();
    Sinon.stub(GetUserBusiness.prototype, 'getUser').resolves(user);
    const response = await getUser(fastify_request({ params: { username: UsersData.username() } }), res);
    expect(status_spy.args).deep.eq([[200]]);
    expect(response).to.deep.equal(user);
  });
  it('Should not get pub key', async () => {
    const status_spy = Sinon.spy(res, 'status');
    const response = await getUser(fastify_request(), res);
    expect(status_spy.args).deep.eq([[400]]);
    expect(response).instanceOf(ValidationError);
  });
});
