/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable dot-notation */
import { expect } from 'chai';
import Sinon from 'sinon';
import { Authorizer } from '../../../src/business/authorizer';
import { USER_COMMON_GROUPS } from '../../../src/constants/groups';
import { ForbiddenError } from '../../../src/exceptions/ForbiddenError';
import { UnauthorizedError } from '../../../src/exceptions/Unauthorized';
import { AuthorizerData } from '../../data/authorizer';
import { CognitoData } from '../../data/cognito';

const authorizer = new Authorizer({ cognito: CognitoData.default() });
const username = 'username';

async function testShouldAuthorize(method_arn: string, group: string) {
  const decoded_token = AuthorizerData.decodedToken(username);
  Sinon.stub(authorizer['cognito'], 'verify').resolves(decoded_token);
  Sinon.stub(authorizer['cognito'], 'getUser').resolves(CognitoData.user(username, group));
  const response = await authorizer.authorize('token', method_arn);
  expect(response).deep.eq(decoded_token);
}

async function testShouldNotAuthorize(method_arn: string, group: string) {
  const decoded_token = AuthorizerData.decodedToken(username);
  Sinon.stub(authorizer['cognito'], 'verify').resolves(decoded_token);
  Sinon.stub(authorizer['cognito'], 'getUser').resolves(CognitoData.user(username, group));
  const response = await authorizer.authorize('token', method_arn).catch((e) => e);
  expect(response).instanceOf(ForbiddenError);
}
function methodPath(arn: string) {
  const [_, __, method, ...path] = arn.split('/');
  return [method, ...path].join('/');
}

describe('Business -> Authorizer', () => {
  beforeEach(Sinon.restore);
  describe('Should authorize admin', () => {
    for (const method_arn of AuthorizerData.allArns(username)) {
      it(methodPath(method_arn), async () => {
        await testShouldAuthorize(method_arn, USER_COMMON_GROUPS.ADMIN);
      });
    }
  });
  describe('Should authorize customer', () => {
    it(methodPath(AuthorizerData.pubKeyArn()), async () => {
      await testShouldAuthorize(AuthorizerData.pubKeyArn(), USER_COMMON_GROUPS.CUSTOMER);
    });
    it(methodPath(AuthorizerData.getUser(username)), async () => {
      await testShouldAuthorize(AuthorizerData.getUser(username), USER_COMMON_GROUPS.CUSTOMER);
    });
    it(methodPath(AuthorizerData.createCustomer()), async () => {
      await testShouldAuthorize(AuthorizerData.createCustomer(), USER_COMMON_GROUPS.CUSTOMER);
    });
  });
  describe('Should not authorize customer', () => {
    it(methodPath(AuthorizerData.getUser('1')), async () => {
      await testShouldNotAuthorize(AuthorizerData.getUser('1'), USER_COMMON_GROUPS.CUSTOMER);
    });
    it(methodPath(AuthorizerData.createAdmin()), async () => {
      await testShouldNotAuthorize(AuthorizerData.createAdmin(), USER_COMMON_GROUPS.CUSTOMER);
    });
    it(methodPath(AuthorizerData.forceAdmin()), async () => {
      await testShouldNotAuthorize(AuthorizerData.forceAdmin(), USER_COMMON_GROUPS.CUSTOMER);
    });
  });
  it('Should throw UnauthorizedError', async () => {
    Sinon.stub(authorizer['cognito'], 'verify').rejects();
    const response = await authorizer.authorize('token', 'method_arn').catch((e) => e);
    expect(response).instanceOf(UnauthorizedError);
  });
});
