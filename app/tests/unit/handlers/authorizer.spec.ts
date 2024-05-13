/* eslint-disable import/no-duplicates */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { APIGatewayRequestAuthorizerEvent, APIGatewayTokenAuthorizerEvent, Callback } from 'aws-lambda';
import { expect } from 'chai';
import Sinon from 'sinon';
import { Authorizer } from '../../../src/business/authorizer';
import { ForbiddenError } from '../../../src/exceptions/ForbiddenError';
import { UnauthorizedError } from '../../../src/exceptions/Unauthorized';
import { authorizer } from '../../../src/handlers/authorizer';
import { GenerateAuthResponse } from '../../../src/utils/generateAuthResponse';
import { AuthorizerData } from '../../data/authorizer';

describe('Handlers -> Authorizer', async () => {
  beforeEach(Sinon.restore);
  describe('Request event', () => {
    const arn = 'arn:aws:execute-api:us-east-1:123456789012:api-id/dev/GET';
    const event = {
      headers: { authorization: 'Bearer token' },
      methodArn: `${arn}/resource`
    } as unknown as APIGatewayRequestAuthorizerEvent;
    it('Should authorize', async () => {
      const token = AuthorizerData.decodedToken('user');
      Sinon.stub(Authorizer.prototype, 'authorize').resolves(token);
      const response = await authorizer(event, {} as any, Sinon.spy());
      expect(response).deep.equal(AuthorizerData.allowPolicyDocument(token.username, token.sub, `${arn}/*`));
    });
    it('Should unauthorize', async () => {
      Sinon.stub(Authorizer.prototype, 'authorize').rejects(new UnauthorizedError());
      const sub = Sinon.spy(GenerateAuthResponse, 'defaultSub');
      let callback_arg: string | undefined;
      const response = await authorizer(
        event,
        {} as any,
        ((arg: string) => {
          callback_arg = arg;
        }) as unknown as Callback
      );
      expect(callback_arg).eq('Unauthorized');
      expect(response).deep.equal(AuthorizerData.denyPolicyDocument(sub.returnValues[0], `${arn}/*`));
    });
    it('Should forbidden', async () => {
      const token = AuthorizerData.decodedToken('user');
      Sinon.stub(Authorizer.prototype, 'authorize').rejects(new ForbiddenError(token));
      const response = await authorizer(event, {} as any, () => {});
      expect(response).deep.equal(AuthorizerData.denyPolicyDocument(token.sub, `${arn}/*`));
    });
  });
  describe('Token event', () => {
    const arn = 'arn:aws:execute-api:us-east-1:123456789012:api-id/dev/GET';
    const event = {
      authorizationToken: 'Bearer token',
      methodArn: `${arn}/resource`
    } as APIGatewayTokenAuthorizerEvent;
    it('Should authorize', async () => {
      const token = AuthorizerData.decodedToken('user');
      Sinon.stub(Authorizer.prototype, 'authorize').resolves(token);
      const response = await authorizer(event, {} as any, Sinon.spy());
      expect(response).deep.equal(AuthorizerData.allowPolicyDocument(token.username, token.sub, `${arn}/*`));
    });
    it('Should unauthorize', async () => {
      Sinon.stub(Authorizer.prototype, 'authorize').rejects(new UnauthorizedError());
      const sub = Sinon.spy(GenerateAuthResponse, 'defaultSub');
      let callback_arg: string | undefined;
      const response = await authorizer(
        event,
        {} as any,
        ((arg: string) => {
          callback_arg = arg;
        }) as unknown as Callback
      );
      expect(callback_arg).eq('Unauthorized');
      expect(response).deep.equal(AuthorizerData.denyPolicyDocument(sub.returnValues[0], `${arn}/*`));
    });
    it('Should forbidden', async () => {
      const token = AuthorizerData.decodedToken('user');
      Sinon.stub(Authorizer.prototype, 'authorize').rejects(new ForbiddenError(token));
      const response = await authorizer(event, {} as any, () => {});
      expect(response).deep.equal(AuthorizerData.denyPolicyDocument(token.sub, `${arn}/*`));
    });
  });
});
