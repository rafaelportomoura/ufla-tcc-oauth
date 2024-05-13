/* eslint-disable dot-notation */
import { expect } from 'chai';
import Sinon from 'sinon';
import { ConfirmForgotPasswordBusiness } from '../../../src/business/confirmForgotPassword';
import { BadRequestError } from '../../../src/exceptions/BadRequestError';
import { CognitoData } from '../../data/cognito';
import { OAuthData } from '../../data/oauth';

describe('Business -> ConfirmForgotPassword', async () => {
  beforeEach(Sinon.restore);
  const confirm_forgot_password = new ConfirmForgotPasswordBusiness({
    cognito: CognitoData.default()
  });
  it('Should confirm', async () => {
    const confirm_forgot_password_stub = Sinon.stub(confirm_forgot_password['cognito'], 'confirmForgotPassword');
    await confirm_forgot_password.confirm(OAuthData.confirmForgotPassword());
    Sinon.assert.calledOnce(confirm_forgot_password_stub);
  });
  it('Should not confirm', async () => {
    const confirm_forgot_password_stub = Sinon.stub(
      confirm_forgot_password['cognito'],
      'confirmForgotPassword'
    ).rejects();
    const response = await confirm_forgot_password.confirm(OAuthData.confirmForgotPassword()).catch((e) => e);
    Sinon.assert.calledOnce(confirm_forgot_password_stub);
    expect(response).instanceOf(BadRequestError);
  });
});
