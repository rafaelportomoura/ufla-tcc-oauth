import { SecretsManager } from '../aws/secretsManager';

export type BasicAuth = {
  username: string;
  password: string;
};

export type BasicAuthArgs = {
  secret: SecretsManager;
  secret_path: string;
};
