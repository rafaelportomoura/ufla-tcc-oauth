/* eslint-disable no-empty-function */
import { SecretsManager } from '../aws/secretsManager';
import { CODE_MESSAGES } from '../constants/codeMessages';
import { UnauthorizedError } from '../exceptions/Unauthorized';
import { BasicAuth, BasicAuthArgs } from '../types/BasicAuth';

export class BasicAuthBusiness {
  private secret_manager: SecretsManager;

  private secret_path: string;

  constructor(args: BasicAuthArgs) {
    this.secret_manager = args.secret;
    this.secret_path = args.secret_path;
  }

  async validate(auth: string): Promise<void> {
    const { username, password } = await this.secret_manager.getSecret<BasicAuth>(this.secret_path);

    const auth_string = `${username}:${password}`;

    const base64 = Buffer.from(auth_string).toString('base64');

    if (base64 !== auth) throw new UnauthorizedError(CODE_MESSAGES.INVALID_CREDENTIALS);
  }
}
