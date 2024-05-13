/* eslint-disable snakecasejs/snakecasejs */
/* eslint-disable dot-notation */
import { expect } from 'chai';
import Sinon from 'sinon';
import { Logger } from '../../../src/adapters/logger';
import { SecretsManager } from '../../../src/aws/secretsManager';
import { BasicAuthBusiness } from '../../../src/business/basicAuth';
import { LoggerLevel } from '../../../src/constants/loggerLevel';
import { UnauthorizedError } from '../../../src/exceptions/Unauthorized';

describe('Business -> BasicAuth', async () => {
  beforeEach(Sinon.restore);
  const basic_auth = new BasicAuthBusiness({
    secret: new SecretsManager({}),
    secret_path: 'path',
    logger: new Logger(LoggerLevel.silent, 'test')
  });
  it('Should validate', async () => {
    const logger_stub = Sinon.stub(basic_auth['logger'], 'debug');
    const getSecret = Sinon.stub(basic_auth['secret_manager'], 'getSecret').resolves({
      username: 'user',
      password: 'password'
    });
    const auth = Buffer.from('user:password').toString('base64');
    await basic_auth.validate(auth);
    Sinon.assert.calledOnce(getSecret);
    Sinon.assert.calledOnce(logger_stub);
    expect(logger_stub.args[0]).deep.eq([auth, auth]);
  });
  it('Should not validate', async () => {
    const logger_stub = Sinon.stub(basic_auth['logger'], 'debug');
    const getSecret = Sinon.stub(basic_auth['secret_manager'], 'getSecret').resolves({
      username: 'user',
      password: 'password'
    });
    const secret_string = Buffer.from('user:password').toString('base64');
    const auth = Buffer.from('user:passworda').toString('base64');
    const response = await basic_auth.validate(auth).catch((e) => e);
    Sinon.assert.calledOnce(getSecret);
    Sinon.assert.calledOnce(logger_stub);
    expect(logger_stub.args[0]).deep.eq([secret_string, auth]);
    expect(response).instanceOf(UnauthorizedError);
  });
});
