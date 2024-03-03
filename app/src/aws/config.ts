import { fromIni } from '@aws-sdk/credential-providers';
import { CONFIGURATION } from '../constants/configuration';
import { AwsParams } from '../types/Aws';

export const aws_config = ({ region, profile }: AwsParams = {}) => {
  const credentials = profile ? fromIni({ profile }) : undefined;
  return {
    region: region ?? CONFIGURATION.REGION,
    credentials
  };
};
