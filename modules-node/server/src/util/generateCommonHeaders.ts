import * as crypto from 'crypto';
import {APIGatewayProxyEvent, Context} from 'aws-lambda';
import {IHeader} from './types';
import {developMode} from './constants';

export const generateCommonHeaders = (
    {
        event,
        body,
        exposedHeaders = {},
    }: {
        event: APIGatewayProxyEvent,
        context: Context,
        body: string,
        exposedHeaders?: IHeader,
    },
): IHeader => {
    const origin = event.headers && event.headers.Origin || '';
    const exposedHeaderNames = Object.keys(exposedHeaders).concat('x-elapsed-seconds', 'x-created-at', 'content-length');
    const etag = crypto.createHash('sha256').update(body).digest('hex');
    return {
        'access-control-allow-origin': developMode ? origin : 'https://maxi.wemo.me',
        'access-control-allow-methods': 'GET, OPTIONS',
        'access-control-expose-headers': exposedHeaderNames.join(', '),
        ...exposedHeaders,
        'x-elapsed-seconds': process.uptime(),
        'x-created-at': new Date().toISOString(),
        'content-length': body.length,
        etag,
    };
};
