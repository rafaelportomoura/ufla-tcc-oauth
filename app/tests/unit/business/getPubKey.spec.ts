import Sinon from 'sinon';
import { aws_config } from '../../../src/aws/config';
/* eslint-disable dot-notation */
import { GetPubKey } from '../../../src/business/getPubKey';

describe('Business -> GetPubKey', async () => {
  beforeEach(Sinon.restore);
  const get_pub_key = new GetPubKey('arn', aws_config({ region: 'us-east-1', profile: 'default' }));
  it('Should get pub key', async () => {
    const get_pub_key_stub = Sinon.stub(get_pub_key['kms'], 'getPubKey').resolves();
    await get_pub_key.get();
    Sinon.assert.calledOnce(get_pub_key_stub);
  });
});
