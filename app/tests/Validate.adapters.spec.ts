import { expect } from 'chai';
import { Validator } from '../src/adapters/validate';
import { CODE_MESSAGES } from '../src/constants/codeMessages';
import { ExampleDTO } from '../src/dtos/example';
import { MockValidator } from './mocks/validate';

describe('Test Suit - Validate', async () => {
  it('Should validate object with CREATE group', async () => {
    const object = { id: 'x', name: 'y' };

    const validator = new Validator(object);

    const result = await validator.validateByClass(ExampleDTO, 'CREATE');

    expect(result).deep.equal(object);
  });

  it('Should validate object', async () => {
    const object = { id: 'x', name: 'y' };

    const validator = new Validator(object);

    const result = await validator.validateByClass(ExampleDTO);

    expect(result).deep.equal(object);
  });

  it('Should  not validate object', async () => {
    const object = { id: 1, name: 'y' };

    const validator = new Validator(object);
    try {
      await validator.validateByClass(ExampleDTO);
    } catch (error) {
      expect(error.code).equal(CODE_MESSAGES.VALIDATION_ERROR.code);
      expect(error.message).equal(MockValidator.invalidType('id', 'string'));
    }
  });
});
