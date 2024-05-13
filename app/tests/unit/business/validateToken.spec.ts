/* eslint-disable dot-notation */
import { expect } from 'chai';
import Sinon from 'sinon';
import { ValidateToken } from '../../../src/business/validateToken';
import { CODE_MESSAGES } from '../../../src/constants/codeMessages';
import { NotFoundError } from '../../../src/exceptions/NotFoundError';
import { UnauthorizedError } from '../../../src/exceptions/Unauthorized';
import { AuthorizerData } from '../../data/authorizer';
import { CognitoData } from '../../data/cognito';

describe('Business -> ValidateToken', async () => {
  beforeEach(Sinon.restore);
  const validate_token = new ValidateToken({
    cognito: CognitoData.default()
  });
  it('Should validate token', async () => {
    Sinon.stub(validate_token['cognito'], 'verify').resolves(AuthorizerData.decodedToken('user'));
    Sinon.stub(validate_token['cognito'], 'getUser').resolves(CognitoData.user('user', 'g'));
    const response = await validate_token.authorize('token');
    expect(response.decoded_token.username).eq('user');
    expect(response.group).eq('g');
  });
  it('Should not validate token', async () => {
    Sinon.stub(validate_token['cognito'], 'verify').throws(new Error());
    const response = await validate_token.authorize('token').catch((e) => e);
    expect(response).instanceof(UnauthorizedError);
  });
  it('Should not found user', async () => {
    Sinon.stub(validate_token['cognito'], 'verify').resolves(AuthorizerData.decodedToken('user'));
    Sinon.stub(validate_token['cognito'], 'getUser').throws(new NotFoundError(CODE_MESSAGES.USER_NOT_FOUND));
    const response = await validate_token.authorize('token').catch((e) => e);
    expect(response).instanceof(NotFoundError);
  });
});
