import {APIGatewayProxyEvent, APIGatewayProxyResult} from 'aws-lambda';

export const generateCORSHeaders = (
    event: APIGatewayProxyEvent,
): APIGatewayProxyResult['headers'] => {
    const origin = event.headers.Origin;
    const allowedOrigin = origin === 'http://localhost:1234' ? origin : '';
    return {
        'access-control-allow-origin': allowedOrigin,
        'access-control-allow-methods': 'GET,OPTIONS',
    };
};
