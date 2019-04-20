import {APIGatewayProxyEvent, APIGatewayProxyResult, Context} from 'aws-lambda';

export const generateCommonHeaders = (
    event: APIGatewayProxyEvent,
    _context: Context,
    exposes: {[name: string]: string} = {},
): APIGatewayProxyResult['headers'] => {
    const origin = event.headers.Origin || '';
    // const allowedOrigin = origin === 'http://localhost:1234' ? origin : '';
    const allowedOrigin = origin.match(/http:\/\/[\w.]+:1234/) ? origin : '';
    const exposedHeaderNames = Object.keys(exposes).concat('x-elapsed-seconds', 'x-created-at');
    return {
        'access-control-allow-origin': allowedOrigin,
        'access-control-allow-methods': 'GET, OPTIONS',
        'access-control-expose-headers': exposedHeaderNames.join(', '),
        ...exposes,
        'x-elapsed-seconds': `${process.uptime()}`,
        'x-created-at': new Date().toISOString(),
    };
};
