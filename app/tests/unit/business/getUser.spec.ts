/* eslint-disable dot-notation */
import { expect } from 'chai';
import Sinon from 'sinon';
import { GetUserBusiness } from '../../../src/business/getUser';
import { NotFoundError } from '../../../src/exceptions/NotFoundError';
import { CognitoData } from '../../data/cognito';

describe('Business -> GetUser', async () => {
  beforeEach(Sinon.restore);
  const get_user = new GetUserBusiness({
    cognito: CognitoData.default()
  });
  it('Should get user', async () => {
    const get_user_stub = Sinon.stub(get_user['cognito'], 'getUser').resolves(CognitoData.user('', ''));
    await get_user.getUser('user');
    Sinon.assert.calledOnce(get_user_stub);
  });
  it('Should not get user', async () => {
    Sinon.stub(get_user['cognito'], 'getUser').resolves(undefined);
    const response = await get_user.getUser('user').catch((e) => e);
    expect(response).instanceOf(NotFoundError);
  });
});
