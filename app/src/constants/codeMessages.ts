import { CONFIGURATION } from './configuration';

const prefix = (code: number) => `${CONFIGURATION.MICROSERVICE}-${String(code).padStart(4, '0')}`;

let n = 0;

export const CODE_MESSAGES = {
  INTERNAL_SERVER_ERROR: {
    code: prefix(n++),
    message: 'Internal Server Error!'
  },
  CANNOT_ACCESS_DATABASE: {
    code: prefix(n++),
    message: 'Cannot access database!'
  },
  VALIDATION_ERROR: {
    code: prefix(n++),
    message: 'Validation Error!'
  },
  NOT_FOUND_ERROR: {
    code: prefix(n++),
    message: 'Not Found Error!'
  },
  CUSTOMER_CREATED: {
    code: prefix(n++),
    message: 'Customer created successfully!'
  },
  ADMIN_CREATED: {
    code: prefix(n++),
    message: 'Admin created successfully!'
  },
  ALREADY_HAS_USERS: {
    code: prefix(n++),
    message: 'Already has users!'
  },
  INVALID_CREDENTIALS: {
    code: prefix(n++),
    message: 'Invalid Credentials!'
  },
  FORGOT_PASSWORD_RESPONSE: {
    code: prefix(n++),
    message: 'An email will be send with verification code!'
  },
  CANT_FINALIZE_FORGOT_PASSWORD: {
    code: prefix(n++),
    message: "Can't finalize forgot password process!"
  },
  CANT_FINALIZE_CONFIRMATION_FORGOT_PASSWORD: {
    code: prefix(n++),
    message: "Can't finalize confirmation forgot password process!"
  },
  PASSWORD_CHANGED_RESPONSE: {
    code: prefix(n++),
    message: 'Password changed!'
  },
  USER_NOT_FOUND: {
    code: prefix(n++),
    message: 'User was not found!'
  },
  FORBIDDEN: {
    code: prefix(n++),
    message: "User can't access this resource!"
  },
  UNAUTHORIZED: {
    code: prefix(n++),
    message: 'Unauthorized!'
  },
  INVALID_PASSWORD_ENCRYPTION: {
    code: prefix(n++),
    message: 'Invalid password encryption!'
  },
  INCORRECT_USERNAME_OR_PASSWORD: {
    code: prefix(n++),
    message: 'Incorrect username or password!'
  },
  PAGE_NOT_FOUND: {
    code: prefix(n++),
    message: 'Page not found!'
  }
} as const;
