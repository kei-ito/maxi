import * as http from 'http';
import {APIGatewayProxyResult} from 'aws-lambda';
import {filterHeadersForAPIGateway} from './filterHeadersForAPIGateway';

export const createErrorResponse = (
    response: http.IncomingMessage
): APIGatewayProxyResult => ({
    statusCode: response.statusCode || 500,
    headers: {
        ...filterHeadersForAPIGateway(response.headers),
        'content-length': 0,
    },
    body: '',
});
