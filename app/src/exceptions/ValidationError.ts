import { CodeMessage } from '../types/CodeMessage';
import { BadRequestError } from './BadRequestError';

export class ValidationError extends BadRequestError {
  constructor(code_message: CodeMessage) {
    super(code_message);
    this.name = 'ValidationError';
  }
}
