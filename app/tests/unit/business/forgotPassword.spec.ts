/* eslint-disable dot-notation */
import { expect } from 'chai';
import Sinon from 'sinon';
import { ForgotPasswordBusiness } from '../../../src/business/forgotPassword';
import { BadRequestError } from '../../../src/exceptions/BadRequestError';
import { CognitoData } from '../../data/cognito';

describe('Business -> ForgotPassword', async () => {
  beforeEach(Sinon.restore);
  const forgot_password = new ForgotPasswordBusiness({
    cognito: CognitoData.default()
  });
  it('Should forgot password', async () => {
    const forgot_password_stub = Sinon.stub(forgot_password['cognito'], 'forgotPassword').resolves();
    await forgot_password.forgot({ username: 'user' });
    Sinon.assert.calledOnce(forgot_password_stub);
  });
  it('Should not forgot password', async () => {
    Sinon.stub(forgot_password['cognito'], 'forgotPassword').throws(new Error());
    const response = await forgot_password.forgot({ username: 'user' }).catch((e) => e);
    expect(response).instanceOf(BadRequestError);
  });
});
