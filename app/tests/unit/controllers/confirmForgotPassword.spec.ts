import { expect } from 'chai';
import Sinon from 'sinon';
import { ConfirmForgotPasswordBusiness } from '../../../src/business/confirmForgotPassword';
import { CODE_MESSAGES } from '../../../src/constants/codeMessages';
import { confirmForgotPassword } from '../../../src/controllers/confirmForgotPassword';
import { ValidationError } from '../../../src/exceptions/ValidationError';
import { AuthorizerData } from '../../data/authorizer';
import { fastify_reply, fastify_request } from '../../data/fastify';

describe('Controller -> ConfirmForgotPassword', async () => {
  const res = fastify_reply();
  beforeEach(Sinon.restore);
  it('Should confirm password', async () => {
    const status_spy = Sinon.spy(res, 'status');
    Sinon.stub(ConfirmForgotPasswordBusiness.prototype, 'confirm').resolves();
    const req = fastify_request({ body: AuthorizerData.confirmForgotPassword() });
    const response = await confirmForgotPassword(req, res);
    expect(status_spy.args).deep.eq([[200]]);
    expect(response).to.deep.equal(CODE_MESSAGES.PASSWORD_CHANGED_RESPONSE);
  });
  it('Should not confirm password', async () => {
    const status_spy = Sinon.spy(res, 'status');
    const req = fastify_request({ body: AuthorizerData.confirmForgotPassword({ username: 2 as unknown as string }) });
    const response = await confirmForgotPassword(req, res);
    expect(status_spy.args).deep.eq([[400]]);
    expect(response).instanceOf(ValidationError);
  });
});
