import * as http from 'http';
import * as util from 'util';
import {APIGatewayProxyResult} from 'aws-lambda';
import {filterHeaders} from './filterHeaders';

export const createErrorResponse = (
    response: http.IncomingMessage
): APIGatewayProxyResult => {
    const body = `${response.statusCode} ${response.statusMessage}`;
    process.stderr.write(`${util.inspect(response)}\n`);
    return {
        statusCode: response.statusCode || 500,
        ...filterHeaders({
            ...response.headers,
            'content-length': body.length,
        }),
        body,
    };
};
