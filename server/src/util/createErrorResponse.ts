import * as http from 'http';
import {APIGatewayProxyResult} from 'aws-lambda';
import {filterHeadersForAPIGateway} from './filterHeadersForAPIGateway';

export const createErrorResponse = (
    response: http.IncomingMessage
): APIGatewayProxyResult => {
    const body = `${response.statusCode} ${response.statusMessage}`;
    console.log(response);
    return {
        statusCode: response.statusCode || 500,
        headers: {
            ...filterHeadersForAPIGateway(response.headers),
            'content-length': body.length,
        },
        body,
    };
};
