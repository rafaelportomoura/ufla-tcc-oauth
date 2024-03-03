export type ValidateTokenArgs = {
  cognito_issuer: string;
};

export type ClaimVerifyRequest = {
  readonly token?: string;
};

export type ClaimVerifyResult = {
  readonly userName: string;
  readonly clientId: string;
  readonly isValid: boolean;
  readonly error?: unknown;
};

export type TokenHeader = {
  kid: string;
  alg: string;
};

export type PublicKey = {
  alg: string;
  e: string;
  kid: string;
  kty: 'RSA';
  n: string;
  use: string;
};
export type PublicKeyMeta = {
  instance: PublicKey;
  pem: string;
};

export type PublicKeys = {
  keys: PublicKey[];
};

export type MapOfKidToPublicKey = {
  [key: string]: PublicKeyMeta;
};

export type Claim = {
  token_use: string;
  auth_time: number;
  iss: string;
  exp: number;
  username: string;
  client_id: string;
};
