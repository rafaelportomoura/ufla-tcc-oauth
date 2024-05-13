import { expect } from 'chai';
import { Validator } from '../../../src/adapters/validate';
import { ValidationError } from '../../../src/exceptions/ValidationError';
import { forgot_password_schema } from '../../../src/schemas/forgot_password';

describe('Adapters -> Validate', async () => {
  it('Should validate forgot_password schema', async () => {
    const validator = new Validator(forgot_password_schema);
    const result = await validator.validate({ username: 'test' });
    expect(result).deep.eq({ username: 'test' });
  });
  it('Should not validate forgot_password schema', async () => {
    const validator = new Validator(forgot_password_schema);
    const result = await validator.validate({ username: 1 }).catch((e) => e);
    expect(result).instanceOf(ValidationError);
    expect(result.issues).deep.eq({ username: ['Expected string, received number'] });
  });
});
