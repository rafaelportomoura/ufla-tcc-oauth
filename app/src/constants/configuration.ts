import { LoggerLevel } from './loggerLevel';

const set_env = <T = string>(key: string, default_value: T): T => (process.env[key] ?? default_value) as T;
const set_number_env = (key: string, default_value: number) => Number(set_env(key, default_value));
const set_string_env = (key: string, default_value: unknown) => String(set_env(key, default_value));

export const CONFIGURATION = {
  STAGE: set_string_env('STAGE', 'development'),
  TENANT: set_string_env('TENANT', 'tcc'),
  REGION: set_string_env('REGION', 'us-east-2'),
  MICROSERVICE: set_string_env('MICROSERVICE', 'oauth'),
  LOG_LEVEL: set_env<LoggerLevel>('LOG_LEVEL', LoggerLevel.debug),
  PORT: set_number_env('PORT', 3000),
  KEY_ARN: set_string_env('KEY_ARN', ''),
  COGNITO_CLIENT_ID: set_string_env('COGNITO_CLIENT_ID', ''),
  COGNITO_USER_POLL: set_string_env('COGNITO_USER_POOL', ''),
  BASIC_AUTH_SECRET: set_string_env('BASIC_AUTH_SECRET', ''),
  COGNITO_SCOPE: set_string_env('COGNITO_SCOPE', 'aws.cognito.signin.user.admin')
} as const;
