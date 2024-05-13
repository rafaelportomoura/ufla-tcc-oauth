/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  CognitoIdentityProviderClient,
  NotAuthorizedException,
  UserNotFoundException
} from '@aws-sdk/client-cognito-identity-provider';
import { CognitoJwtVerifier } from 'aws-jwt-verify';
import { expect } from 'chai';
import Sinon from 'sinon';
import { Cognito } from '../../../src/aws/cognito';
import { USER_COMMON_GROUPS } from '../../../src/constants/groups';
import { BadRequestError } from '../../../src/exceptions/BadRequestError';
import { NotFoundError } from '../../../src/exceptions/NotFoundError';
import { UnauthorizedError } from '../../../src/exceptions/Unauthorized';
import { ListUserResponse } from '../../../src/types/ListUsers';
import { AuthorizerData } from '../../data/authorizer';
import { CognitoData } from '../../data/cognito';
import { UsersData } from '../../data/users';

describe('AWS -> Cognito', () => {
  beforeEach(Sinon.restore);
  const cognito = new Cognito('us-east-2_334NEqSbZ', '601r8kvmslt416fv8829shkiai', 'scope', {});
  it('Should create a new user', async () => {
    const payload = UsersData.create_user();
    const stub = Sinon.stub(CognitoIdentityProviderClient.prototype, 'send').resolves({
      User: { Username: payload.username }
    });
    const response = await cognito.createUser(payload, USER_COMMON_GROUPS.ADMIN);
    expect(response.User?.Username).eq(payload.username);
    expect(stub.calledOnce).eq(true);
  });
  it('Should set user password', async () => {
    const payload = UsersData.setUserPassword();
    const stub = Sinon.stub(CognitoIdentityProviderClient.prototype, 'send').resolves({});
    await cognito.setUserPassword(payload);
    expect(stub.calledOnce).eq(true);
  });
  it('Should get user', async () => {
    const stub = Sinon.stub(CognitoIdentityProviderClient.prototype, 'send').resolves(UsersData.user());
    await cognito.getUser(UsersData.username());
    expect(stub.calledOnce).eq(true);
  });
  it('Should throw not found user when not found user', async () => {
    Sinon.stub(CognitoIdentityProviderClient.prototype, 'send').throws(
      new UserNotFoundException({ message: '', $metadata: {} })
    );
    const response = await cognito.getUser(UsersData.username()).catch((e) => e);
    expect(response).instanceof(NotFoundError);
  });
  it('Should throw error when get user', async () => {
    Sinon.stub(CognitoIdentityProviderClient.prototype, 'send').throws(new Error());
    const response = await cognito.getUser(UsersData.username()).catch((e) => e);
    expect(response).instanceof(Error);
    expect(response).not.instanceof(NotFoundError);
  });
  it('Should login', async () => {
    const payload = AuthorizerData.login();
    const stub = Sinon.stub(CognitoIdentityProviderClient.prototype, 'send').resolves({});
    await cognito.login(payload);
    expect(stub.calledOnce).eq(true);
  });
  it('Should throw bad request when login', async () => {
    const payload = AuthorizerData.login();
    Sinon.stub(CognitoIdentityProviderClient.prototype, 'send').throws(
      new NotAuthorizedException({ message: '', $metadata: {} })
    );
    const response = await cognito.login(payload).catch((e) => e);
    expect(response).instanceOf(BadRequestError);
  });
  it('Should throw error when login', async () => {
    const payload = AuthorizerData.login();
    Sinon.stub(CognitoIdentityProviderClient.prototype, 'send').throws(new Error());
    const response = await cognito.login(payload).catch((e) => e);
    expect(response).not.instanceOf(BadRequestError);
  });
  it('Should forgot password', async () => {
    const stub = Sinon.stub(CognitoIdentityProviderClient.prototype, 'send').resolves({});
    await cognito.forgotPassword(UsersData.username());
    expect(stub.calledOnce).eq(true);
  });
  it('Should confirm forgot password', async () => {
    const stub = Sinon.stub(CognitoIdentityProviderClient.prototype, 'send').resolves({});
    await cognito.confirmForgotPassword(AuthorizerData.confirmForgotPassword());
    expect(stub.calledOnce).eq(true);
  });
  it('Should get group', async () => {
    const group = cognito.getGroup([UsersData.userAttribute()]);
    expect(group).eq(USER_COMMON_GROUPS.ADMIN);
  });
  it('Should map attributes', async () => {
    const map = cognito.mapAttributes([UsersData.userAttribute()]);
    expect(map).deep.eq({ 'custom:group': USER_COMMON_GROUPS.ADMIN });
  });
  it('Should verify token', async () => {
    const stub = Sinon.stub(CognitoJwtVerifier.prototype, 'verify').resolves({} as any);
    await cognito.verify('token');
    expect(stub.calledOnce).eq(true);
  });
  it('Should throw error when verify token', async () => {
    Sinon.stub(CognitoJwtVerifier.prototype, 'verify').throws(new Error());
    const response = await cognito.verify('token').catch((e) => e);
    expect(response).instanceOf(UnauthorizedError);
  });
  it('Should list users at page 1', async () => {
    const stub = Sinon.stub(CognitoIdentityProviderClient.prototype, 'send');
    stub.onFirstCall().resolves({ Users: [CognitoData.user('user1', 'g')], PaginationToken: 'token' });
    stub.onSecondCall().resolves({ Users: [CognitoData.user('user2', 'g')] });
    const response = await cognito.listUsers({ page: 1, size: 1 });
    expect(response.next).eq(true);
    expect(stub.calledOnce).eq(true);
    expect((response.users as ListUserResponse['users'])[0].Username).eq('user1');
  });
  it('Should list users at page 2', async () => {
    const stub = Sinon.stub(CognitoIdentityProviderClient.prototype, 'send');
    stub.onFirstCall().resolves({ Users: [CognitoData.user('user1', 'g')], PaginationToken: 'token' });
    stub.onSecondCall().resolves({ Users: [CognitoData.user('user2', 'g')] });
    const response = await cognito.listUsers({ page: 2, size: 1 });
    expect(response.next).eq(false);
    expect(stub.calledOnce).eq(false);
    expect((response.users as ListUserResponse['users'])[0].Username).eq('user2');
  });
  it('Should throw not found error when list users at page 3', async () => {
    const stub = Sinon.stub(CognitoIdentityProviderClient.prototype, 'send');
    stub.onFirstCall().resolves({ Users: [UsersData.user({ username: 'user1' })], PaginationToken: 'token' });
    stub.onSecondCall().resolves({ Users: [UsersData.user({ username: 'user2' })] });
    const response = await cognito.listUsers({ page: 3, size: 1 }).catch((e) => e);
    expect(response).instanceof(NotFoundError);
    expect(stub.calledOnce).eq(false);
  });
});
