import {APIGatewayProxyEvent} from 'aws-lambda';
import {IFilledAPIGatewayProxyEvent} from './types';
import {normalizeTokens} from './normalizeTokens';

export const fillEvent = (
    event: APIGatewayProxyEvent,
): IFilledAPIGatewayProxyEvent => ({
    httpMethod: event.httpMethod,
    path: event.path,
    headers: normalizeTokens(event.headers, event.multiValueHeaders),
    pathParameters: event.pathParameters || {},
    queryStringParameters: normalizeTokens(event.queryStringParameters, event.multiValueQueryStringParameters),
    stageVariables: event.stageVariables || {},
    requestContext: event.requestContext,
    resource: event.resource,
    body: event.body,
    isBase64Encoded: event.isBase64Encoded,
});
