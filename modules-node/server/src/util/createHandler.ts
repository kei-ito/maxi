import {createHash} from 'crypto';
import {APIGatewayProxyEvent, Context, APIGatewayProxyHandler} from 'aws-lambda';
import {IHandler} from './types';
import {filterHeaders} from './filterHeaders';
import {developMode} from './constants';
import {callHandler} from './callHandler';
import {fillEvent} from './fillEvent';

export const createHandler = (
    handler: IHandler,
): APIGatewayProxyHandler => async (
    event: APIGatewayProxyEvent,
    context: Context,
) => {
    const filledEvent = fillEvent(event);
    const {
        statusCode,
        headers = {},
        exposedHeaders = {},
        body = '',
    } = await callHandler(handler, filledEvent, context);
    const responseBody = Buffer.isBuffer(body) ? body : Buffer.from(body || '');
    const etag = createHash('sha256').update(responseBody).digest('base64');
    headers.etag = etag;
    const exposedHeaderNames = Object.keys(exposedHeaders).concat('x-elapsed-seconds', 'x-created-at', 'content-length');
    headers['access-control-allow-origin'] = developMode ? filledEvent.headers.origin : 'https://maxi.wemo.me',
    headers['access-control-allow-methods'] = 'GET, OPTIONS',
    headers['access-control-expose-headers'] = exposedHeaderNames.join(', '),
    Object.assign(headers, exposedHeaders);
    headers['x-elapsed-seconds'] = process.uptime(),
    headers['x-created-at'] = new Date().toISOString(),
    headers['content-length'] = responseBody.length;
    return {
        statusCode,
        ...filterHeaders(headers),
        body: responseBody.toString(),
    };
};
