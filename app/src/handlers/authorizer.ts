import { APIGatewayRequestAuthorizerEventV2, APIGatewaySimpleAuthorizerWithContextResult } from 'aws-lambda';
import { AuthorizerBusiness } from '../business/authorizer';
import { AuthorizerContext } from '../types/Authorizer';

export async function authorizer(
  event: APIGatewayRequestAuthorizerEventV2
): Promise<APIGatewaySimpleAuthorizerWithContextResult<AuthorizerContext>> {
  try {
    const {
      headers: { authorization },
      pathParameters: path_parameters,
      rawPath: path
    } = event;
    const authorizer_business = new AuthorizerBusiness();
    const { is_authorized, context } = await authorizer_business.authorize({ authorization, path_parameters, path });
    return {
      isAuthorized: is_authorized,
      context
    };
  } catch (error) {
    return {
      isAuthorized: false,
      context: {}
    };
  }
}
