import { CONFIGURATION } from './configuration';

const prefix = (code: string) => `${CONFIGURATION.MICROSERVICE}-${code}`;

export const CODE_MESSAGES = {
  INTERNAL_SERVER_ERROR: {
    code: prefix('0000'),
    message: 'Internal Server Error!'
  },
  CANNOT_ACCESS_DATABASE: {
    code: prefix('0001'),
    message: 'Cannot access database!'
  },
  VALIDATION_ERROR: {
    code: prefix('0002'),
    message: 'Validation Error!'
  },
  NOT_FOUND_ERROR: {
    code: prefix('0003'),
    message: 'Not Found Error!'
  },
  CUSTOMER_CREATED: {
    code: prefix('0004'),
    message: 'Customer created successfully!'
  },
  INVALID_CREDENTIALS: {
    code: prefix('0005'),
    message: 'Invalid Credentials!'
  },
  FORGOT_PASSWORD_RESPONSE: {
    code: prefix('0006'),
    message: 'An email will be send with verification code!'
  },
  CANT_FINALIZE_FORGOT_PASSWORD: {
    code: prefix('0007'),
    message: "Can't finalize forgot password process!"
  },
  CANT_FINALIZE_CONFIRMATION_FORGOT_PASSWORD: {
    code: prefix('0008'),
    message: "Can't finalize confirmation forgot password process!"
  },
  PASSWORD_CHANGED_RESPONSE: {
    code: prefix('0009'),
    message: 'Password changed!'
  }
} as const;
