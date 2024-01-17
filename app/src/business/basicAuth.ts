/* eslint-disable no-empty-function */
import { SecretsManager } from '../aws/secretsManager';
import { CODE_MESSAGES } from '../constants/codeMessages';
import { CONFIGURATION } from '../constants/configuration';
import { NotAuthorized } from '../exceptions/NotAuthorized';
import { BasicAuth } from '../types/BasicAuth';

export class BasicAuthBusiness {
  constructor(
    private secret_path = CONFIGURATION.BASIC_AUTH_SECRET,
    private secret_manager = new SecretsManager()
  ) {}

  async validate(auth: string): Promise<void> {
    const { username, password } = await this.secret_manager.getSecret<BasicAuth>(this.secret_path);

    const auth_string = `${username}:${password}`;

    const base64 = Buffer.from(auth_string).toString('base64');

    if (base64 !== auth) throw new NotAuthorized(CODE_MESSAGES.INVALID_CREDENTIALS);
  }
}
