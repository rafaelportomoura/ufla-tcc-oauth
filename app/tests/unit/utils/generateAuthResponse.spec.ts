import { expect } from 'chai';
import Sinon from 'sinon';
import { GenerateAuthResponse } from '../../../src/utils/generateAuthResponse';
import { AuthorizerData } from '../../data/authorizer';
import { UsersData } from '../../data/users';

describe('Utils -> GenerateAuthResponse', () => {
  const username = UsersData.username();
  const token = AuthorizerData.decodedToken(username);
  const arn = AuthorizerData.getUser();
  const method_arn = AuthorizerData.methodArn('GET', '*');
  it('Should allow policy', () => {
    const response = GenerateAuthResponse.success(token, arn);
    expect(response).deep.equal(AuthorizerData.allowPolicyDocument(username, token.sub, method_arn));
  });
  it('Should deny policy', () => {
    const response = GenerateAuthResponse.error(token.sub, method_arn);
    expect(response).deep.equal(AuthorizerData.denyPolicyDocument(token.sub, method_arn));
  });
  it('Should deny policy with default sub', () => {
    Sinon.restore();
    const spy = Sinon.spy(GenerateAuthResponse, 'defaultSub');
    const response = GenerateAuthResponse.error(undefined, method_arn);
    expect(response).deep.equal(AuthorizerData.denyPolicyDocument(spy.returnValues[0], method_arn));
  });
});
