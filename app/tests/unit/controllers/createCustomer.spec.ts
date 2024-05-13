import { expect } from 'chai';
import Sinon from 'sinon';
import { CreateUserBusiness } from '../../../src/business/createUser';
import { CODE_MESSAGES } from '../../../src/constants/codeMessages';
import { createCustomer } from '../../../src/controllers/createCustomer';
import { ValidationError } from '../../../src/exceptions/ValidationError';
import { fastify_reply, fastify_request } from '../../data/fastify';
import { UsersData } from '../../data/users';

describe('Controller -> CreateCustomer', async () => {
  beforeEach(Sinon.restore);
  const res = fastify_reply();
  it('Should create customer', async () => {
    const status_spy = Sinon.spy(res, 'status');
    const req = fastify_request({ body: UsersData.create_user() });
    Sinon.stub(CreateUserBusiness.prototype, 'create').resolves();
    const response = await createCustomer(req, res);
    expect(status_spy.args).deep.eq([[201]]);
    expect(response).to.deep.equal(CODE_MESSAGES.CUSTOMER_CREATED);
  });
  it('Should not create customer', async () => {
    const status_spy = Sinon.spy(res, 'status');
    const req = fastify_request({ body: UsersData.create_user({ username: 2 as unknown as string }) });
    const response = await createCustomer(req, res);
    expect(status_spy.args).deep.eq([[400]]);
    expect(response).instanceOf(ValidationError);
  });
});
