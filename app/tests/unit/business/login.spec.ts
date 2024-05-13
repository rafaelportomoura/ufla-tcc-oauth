/* eslint-disable dot-notation */
import { expect } from 'chai';
import Sinon from 'sinon';
import { KMS } from '../../../src/aws/kms';
import { LoginBusiness } from '../../../src/business/login';
import { CognitoData } from '../../data/cognito';

describe('Business -> Login', () => {
  beforeEach(Sinon.restore);
  const login = new LoginBusiness({ cognito: CognitoData.default(), kms: new KMS('', {}) });
  it('Should login', async () => {
    Sinon.stub(login['cognito'], 'login').resolves({ AuthenticationResult: {} });
    Sinon.stub(login['kms'], 'decrypt').resolves('password');
    Sinon.stub(login['cognito'], 'getUser').resolves(CognitoData.user('', 'g'));
    const response = await login.login({ username: 'user', password: 'password' });
    expect(response.group).deep.eq('g');
  });
});
