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
  }
} as const;
