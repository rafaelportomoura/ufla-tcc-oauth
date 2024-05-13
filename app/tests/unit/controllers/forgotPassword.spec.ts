import { expect } from 'chai';
import Sinon from 'sinon';
import { ForgotPasswordBusiness } from '../../../src/business/forgotPassword';
import { CODE_MESSAGES } from '../../../src/constants/codeMessages';
import { forgotPassword } from '../../../src/controllers/forgotPassword';
import { ValidationError } from '../../../src/exceptions/ValidationError';
import { fastify_reply, fastify_request } from '../../data/fastify';
import { UsersData } from '../../data/users';

describe('Controller -> ForgotPassword', async () => {
  beforeEach(Sinon.restore);
  const res = fastify_reply();
  it('Should forgot password', async () => {
    const status_spy = Sinon.spy(res, 'status');
    const req = fastify_request({ body: { username: UsersData.username() } });
    Sinon.stub(ForgotPasswordBusiness.prototype, 'forgot').resolves();
    const response = await forgotPassword(req, res);
    expect(status_spy.args).deep.eq([[201]]);
    expect(response).to.deep.equal(CODE_MESSAGES.PASSWORD_CHANGED_RESPONSE);
  });
  it('Should not forgot password', async () => {
    const status_spy = Sinon.spy(res, 'status');
    const req = fastify_request({ body: { username: 2 as unknown as string } });
    const response = await forgotPassword(req, res);
    expect(status_spy.args).deep.eq([[400]]);
    expect(response).instanceOf(ValidationError);
  });
});
