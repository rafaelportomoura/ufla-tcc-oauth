export type Login = {
  username: string;
  password: string;
};

export type LoginResponse = {
  access_token: string;
  refresh_token: string;
  expiration_time: number;
  token_type: string;
  group: string;
};
