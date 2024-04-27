import { CognitoAccessTokenPayload } from 'aws-jwt-verify/jwt-model';
import { Cognito } from '../aws/cognito';

export type ValidateTokenArgs = {
  cognito: Cognito;
};

export type ValidateTokenResponse = {
  decoded_token: CognitoAccessTokenPayload;
  group: string;
};
