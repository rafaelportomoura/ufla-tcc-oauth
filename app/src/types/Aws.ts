import { fromIni as from_ini } from '@aws-sdk/credential-providers';

export type AwsParams = {
  region?: string;
  profile?: string;
};

export type AwsConfig = {
  region: string;
  credentials?: ReturnType<typeof from_ini> | undefined;
};
