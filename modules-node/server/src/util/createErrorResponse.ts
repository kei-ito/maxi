import * as http from 'http';
import * as util from 'util';
import {APIGatewayProxyResult} from 'aws-lambda';
import {filterHeadersForAPIGateway} from './filterHeadersForAPIGateway';

export const createErrorResponse = (
    response: http.IncomingMessage
): APIGatewayProxyResult => {
    const body = `${response.statusCode} ${response.statusMessage}`;
    process.stderr.write(`${util.inspect(response)}\n`);
    return {
        statusCode: response.statusCode || 500,
        headers: {
            ...filterHeadersForAPIGateway(response.headers),
            'content-length': body.length,
        },
        body,
    };
};
