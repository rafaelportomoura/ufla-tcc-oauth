import { SecretsManager } from '../aws/secretsManager';
import { Logger } from './Logger';

export type BasicAuth = {
  username: string;
  password: string;
};

export type BasicAuthArgs = {
  secret: SecretsManager;
  secret_path: string;
  logger: Logger;
};
