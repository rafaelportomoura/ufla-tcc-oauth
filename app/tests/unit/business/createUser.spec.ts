/* eslint-disable dot-notation */
import { expect } from 'chai';
import Sinon from 'sinon';
import { KMS } from '../../../src/aws/kms';
import { CreateUserBusiness } from '../../../src/business/createUser';
import { USER_COMMON_GROUPS } from '../../../src/constants/groups';
import { CognitoData } from '../../data/cognito';
import { UsersData } from '../../data/users';

describe('Business -> CreateUser', async () => {
  beforeEach(Sinon.restore);
  const create_user = new CreateUserBusiness({
    group: USER_COMMON_GROUPS.ADMIN,
    kms: new KMS('arn', {}),
    cognito: CognitoData.default()
  });

  it('Should create', async () => {
    Sinon.stub(create_user['kms'], 'decrypt').resolves('password');
    const create_user_stub = Sinon.stub(create_user['cognito'], 'createUser');
    const set_user_password_stub = Sinon.stub(create_user['cognito'], 'setUserPassword');
    await create_user.create(UsersData.create_user());
    Sinon.assert.calledOnce(create_user_stub);
    Sinon.assert.calledOnce(set_user_password_stub);
  });

  it('Should not create', async () => {
    Sinon.stub(create_user['kms'], 'decrypt').resolves('password');
    Sinon.stub(create_user['cognito'], 'createUser').throws(new Error());
    const response = await create_user.create(UsersData.create_user()).catch((e) => e);
    expect(response).deep.eq(new Error());
  });
});
