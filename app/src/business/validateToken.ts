/* eslint-disable no-use-before-define */
import * as jsonwebtoken from 'jsonwebtoken';
import jwkToPem from 'jwk-to-pem';
import { promisify } from 'util';
import { Api } from '../adapters/api';
import { UnauthorizedError } from '../exceptions/Unauthorized';
import { DecodedToken } from '../types/Authorizer';
import { MapOfKidToPublicKey, PublicKeys, ValidateTokenArgs } from '../types/ValidateToken';

export class ValidateToken {
  private static instance: ValidateToken;

  private cognito_issuer: string;

  private api: Api;

  private cached_key: MapOfKidToPublicKey;

  private constructor({ cognito_issuer }: ValidateTokenArgs) {
    this.cognito_issuer = cognito_issuer;
    this.api = new Api();
  }

  static creator(args: ValidateTokenArgs): ValidateToken {
    if (!this.instance) this.instance = new ValidateToken(args);
    return this.instance;
  }

  async getPublicKeys(): Promise<MapOfKidToPublicKey> {
    if (this.cached_key) return this.cached_key;

    const url = `${this.cognito_issuer}/.well-known/jwks.json`;
    const public_keys = await this.api.get<PublicKeys>(url);
    this.cached_key = public_keys.keys.reduce((agg, current) => {
      const pem = jwkToPem(current);
      agg[current.kid] = { instance: current, pem };
      return agg;
    }, {} as MapOfKidToPublicKey);

    return this.cached_key;
  }

  async verify(token: string): Promise<DecodedToken> {
    const keys = await this.getPublicKeys();
    const sections = token.split('.');
    if (sections.length < 2) throw new UnauthorizedError();
    const header = JSON.parse(Buffer.from(sections[0], 'base64').toString('utf8'));
    const key = keys[header.kid];
    if (!key) throw new UnauthorizedError();

    const verify_promised = promisify(jsonwebtoken.verify.bind(jsonwebtoken));

    const claim = await verify_promised(token, key.pem);

    const current_seconds = Math.floor(new Date().valueOf() / 1000);

    if (current_seconds > claim.exp || current_seconds < claim.auth_time) throw new UnauthorizedError();

    if (this.cognito_issuer !== claim.iss) throw new UnauthorizedError();

    if (claim.token_use !== 'access') throw new UnauthorizedError();

    return claim as DecodedToken;
  }
}
