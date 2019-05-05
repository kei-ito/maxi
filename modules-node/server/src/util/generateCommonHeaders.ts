import {APIGatewayProxyEvent, Context} from 'aws-lambda';
import {IHeader} from './types';
import {developMode} from './constants';

export const generateCommonHeaders = (
    event: APIGatewayProxyEvent,
    _context: Context,
    exposes: IHeader = {},
): IHeader => {
    const origin = event.headers && event.headers.Origin || '';
    const exposedHeaderNames = Object.keys(exposes).concat('x-elapsed-seconds', 'x-created-at');
    return {
        'access-control-allow-origin': developMode ? origin : 'https://maxi.wemo.me',
        'access-control-allow-methods': 'GET, OPTIONS',
        'access-control-expose-headers': exposedHeaderNames.join(', '),
        ...exposes,
        'x-elapsed-seconds': process.uptime(),
        'x-created-at': new Date().toISOString(),
    };
};
