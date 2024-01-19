import { z } from 'zod';
import { CODE_MESSAGES } from '../constants/codeMessages';
import { BadRequestError } from './BadRequestError';

export class ValidationError<T> extends BadRequestError {
  issues: { [k in keyof T]: string[] };

  constructor(issues: z.ZodFormattedError<T, string>) {
    super(CODE_MESSAGES.VALIDATION_ERROR);
    this.issues = this.formatIssues(issues);
    this.name = 'ValidationError';
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  formatIssues({ _errors, ...properties_issues }: z.ZodFormattedError<T, string>): { [k in keyof T]: string[] } {
    const issues = {} as { [k in keyof T]: string[] };
    for (const [key, { _errors: errors }] of Object.entries<{ _errors: string[] }>(
      properties_issues as unknown as { [k in keyof T]: { _errors: string[] } }
    )) {
      issues[key as keyof T] = errors;
    }
    return issues;
  }

  toJSON() {
    const { issues } = this;
    return { ...super.toJSON(), issues };
  }
}
