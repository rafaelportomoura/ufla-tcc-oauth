import { APIGatewayRequestAuthorizerEvent, APIGatewayTokenAuthorizerEvent, Callback, Context } from 'aws-lambda';
import { log } from 'console';
import { Cognito } from '../aws/cognito';
import { aws_config } from '../aws/config';
import { Authorizer } from '../business/authorizer';
import { CONFIGURATION } from '../constants/configuration';
import { UnauthorizedError } from '../exceptions/Unauthorized';
import { GenerateAuthResponse } from '../utils/generateAuthResponse';

export async function authorizer(
  event: APIGatewayRequestAuthorizerEvent,
  _context: Context,
  callback: Callback
): Promise<unknown> {
  const { headers, methodArn } = event;
  const { authorizationToken: authorization_token } = event as unknown as APIGatewayTokenAuthorizerEvent;

  try {
    const token = headers ? (headers.authorization?.split(' ')[1] as string) : authorization_token.split(' ')[1];

    const authorizer_business = new Authorizer({
      cognito: new Cognito(
        CONFIGURATION.COGNITO_USER_POLL,
        CONFIGURATION.COGNITO_CLIENT_ID,
        CONFIGURATION.COGNITO_SCOPE,
        aws_config()
      )
    });

    const decoded_token = await authorizer_business.authorize(token, methodArn);

    const authorizer_response = GenerateAuthResponse.success(decoded_token, methodArn);

    return authorizer_response;
  } catch (error) {
    log('Error', error.message);
    if (error instanceof UnauthorizedError) callback('Unauthorized');
    return GenerateAuthResponse.error(error.sub, methodArn);
  }
}
