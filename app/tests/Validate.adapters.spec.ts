import { expect } from 'chai';
import { Validator } from '../src/adapters/validate';
import { CODE_MESSAGES } from '../src/constants/codeMessages';
import { CreateCustomerDTO } from '../src/dtos/customer';
import { MockValidator } from './mocks/validate';

describe('Test Suit - Validate', async () => {
  it('Should validate object with CREATE group', async () => {
    const object = { email: 'x', password: 'y' };

    const validator = new Validator(object);

    const result = await validator.validateByClass(CreateCustomerDTO, 'CREATE');

    expect(result).deep.equal(object);
  });

  it('Should validate object', async () => {
    const object = { email: 'x', password: 'y' };

    const validator = new Validator(object);

    const result = await validator.validateByClass(CreateCustomerDTO);

    expect(result).deep.equal(object);
  });

  it('Should  not validate object', async () => {
    const object = { email: 1, password: 'y' };

    const validator = new Validator(object);
    try {
      await validator.validateByClass(CreateCustomerDTO);
    } catch (error) {
      expect(error.code).equal(CODE_MESSAGES.VALIDATION_ERROR.code);
      expect(error.message).equal(MockValidator.invalidType('email', 'string'));
    }
  });
});
