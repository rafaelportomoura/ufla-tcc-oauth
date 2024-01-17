export type Authorizer = {
  authorization: string;
  path: string;
  path_parameters: Record<string, string>;
};

export type AuthorizerContext = {
  username?: string;
};

export type AuthorizerResponse = {
  is_authorized: boolean;
  context?: AuthorizerContext;
};

export type DecodedToken = {
  username: string;
  sub: string;
  iss: string;
  client_id: string;
  origin_jti: string;
  event_id: string;
  token_use: string;
  scope: string;
  auth_time: number;
  exp: number;
  iat: number;
  jti: string;
};
