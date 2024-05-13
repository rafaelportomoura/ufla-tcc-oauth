/* eslint-disable dot-notation */
import { expect } from 'chai';
import Sinon from 'sinon';
import { ListUserBusiness } from '../../../src/business/listUser';
import { CognitoData } from '../../data/cognito';

describe('Business -> List User', () => {
  beforeEach(Sinon.restore);
  const list_user = new ListUserBusiness({ cognito: CognitoData.default() });
  it('Should list users', async () => {
    Sinon.stub(list_user['cognito'], 'listUsers').resolves({
      users: [CognitoData.user('', '')],
      next: false
    });
    const response = await list_user.list({ page: 1, size: 1 });
    expect(response).deep.eq({ users: [CognitoData.user('', '')], next: false });
  });
});
