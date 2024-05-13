import { expect } from 'chai';
import Sinon from 'sinon';
import { BasicAuthBusiness } from '../../../src/business/basicAuth';
import { CreateUserBusiness } from '../../../src/business/createUser';
import { ListUserBusiness } from '../../../src/business/listUser';
import { CODE_MESSAGES } from '../../../src/constants/codeMessages';
import { sysAdminCreateAdmin } from '../../../src/controllers/sysAdminCreateAdmin';
import { UnauthorizedError } from '../../../src/exceptions/Unauthorized';
import { CognitoData } from '../../data/cognito';
import { fastify_reply, fastify_request } from '../../data/fastify';
import { UsersData } from '../../data/users';

describe('Controller -> ForceCreateAdmin', async () => {
  beforeEach(Sinon.restore);
  const res = fastify_reply();
  it('Should force create admin', async () => {
    const status_spy = Sinon.spy(res, 'status');
    const req = fastify_request({ body: UsersData.create_user(), headers: { authorization: 'Bearer dsaodjaodoa' } });
    Sinon.stub(CreateUserBusiness.prototype, 'create').resolves();
    Sinon.stub(BasicAuthBusiness.prototype, 'validate').resolves();
    Sinon.stub(ListUserBusiness.prototype, 'list').resolves({ users: [], next: false });
    const response = await sysAdminCreateAdmin(req, res);
    expect(status_spy.args).deep.eq([[201]]);
    expect(response).to.deep.equal(CODE_MESSAGES.ADMIN_CREATED);
  });
  it('Should not authorize to force create admin', async () => {
    const status_spy = Sinon.spy(res, 'status');
    const req = fastify_request();
    const response = await sysAdminCreateAdmin(req, res);
    expect(status_spy.args).deep.eq([[401]]);
    expect(response).instanceOf(UnauthorizedError);
  });
  it('Should not create admin when already has a user', async () => {
    const status_spy = Sinon.spy(res, 'status');
    const req = fastify_request({ body: UsersData.create_user(), headers: { authorization: 'Bearer dsaodjaodoa' } });
    Sinon.stub(CreateUserBusiness.prototype, 'create').resolves();
    Sinon.stub(BasicAuthBusiness.prototype, 'validate').resolves();
    Sinon.stub(ListUserBusiness.prototype, 'list').resolves({ users: [CognitoData.userType('', '')], next: false });
    const response = await sysAdminCreateAdmin(req, res);
    expect(status_spy.args).deep.eq([[409]]);
    expect(response).to.deep.equal(CODE_MESSAGES.ALREADY_HAS_USERS);
  });
});
