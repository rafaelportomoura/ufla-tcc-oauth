/* eslint-disable no-empty-function */
import { SecretsManager } from '../aws/secretsManager';
import { CODE_MESSAGES } from '../constants/codeMessages';
import { UnauthorizedError } from '../exceptions/Unauthorized';
import { BasicAuth, BasicAuthArgs } from '../types/BasicAuth';
import { Logger } from '../types/Logger';

export class BasicAuthBusiness {
  private secret_manager: SecretsManager;

  private secret_path: string;

  private logger: Logger;

  constructor(args: BasicAuthArgs) {
    this.secret_manager = args.secret;
    this.secret_path = args.secret_path;
    this.logger = args.logger;
  }

  async validate(auth: string): Promise<void> {
    const { username, password } = await this.secret_manager.getSecret<BasicAuth>(this.secret_path);

    const auth_string = `${username}:${password}`;

    const base64 = Buffer.from(auth_string).toString('base64');
    this.logger.debug(base64, auth);
    if (base64 !== auth) throw new UnauthorizedError(CODE_MESSAGES.INVALID_CREDENTIALS);
  }
}
