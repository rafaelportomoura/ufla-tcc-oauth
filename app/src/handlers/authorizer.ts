import {
  APIGatewayAuthorizerResult,
  APIGatewayRequestAuthorizerEventV2,
  APIGatewaySimpleAuthorizerWithContextResult
} from 'aws-lambda';
import { AuthorizerBusiness } from '../business/authorizer';

import { aws_config } from '../aws/config';
import { CONFIGURATION } from '../constants/configuration';
import { ForbiddenError } from '../exceptions/ForbiddenError';
import { Authorizer, AuthorizerContext } from '../types/Authorizer';

function forbiddenPolicy(event: APIGatewayRequestAuthorizerEventV2): APIGatewayAuthorizerResult {
  return {
    principalId: CONFIGURATION.COGNITO_CLIENT_ID,
    policyDocument: {
      Version: '2012-10-17',
      Statement: [
        {
          Action: 'execute-api:Invoke',
          Effect: 'Deny',
          Resource: event.routeArn
        }
      ]
    }
  };
}

export async function authorizer(
  event: APIGatewayRequestAuthorizerEventV2
): Promise<APIGatewaySimpleAuthorizerWithContextResult<AuthorizerContext> | APIGatewayAuthorizerResult> {
  const authorizer_business = new AuthorizerBusiness({
    aws_config: aws_config(),
    pool_id: CONFIGURATION.COGNITO_USER_POLL,
    client_id: CONFIGURATION.COGNITO_CLIENT_ID,
    cognito_issuer: CONFIGURATION.COGNITO_ISSUER
  });
  try {
    const { headers, pathParameters: path_parameters, routeArn: arn } = event;

    const params: Authorizer = {
      arn,
      path_parameters: (path_parameters as Record<string, string>) ?? {},
      authorization: headers?.authorization as string
    };

    const { is_authorized, context } = await authorizer_business.authorize(params);
    return {
      isAuthorized: is_authorized,
      context: context ?? {}
    };
  } catch (error) {
    if (error instanceof ForbiddenError) return forbiddenPolicy(event);
    return {
      isAuthorized: false,
      context: {}
    };
  }
}
