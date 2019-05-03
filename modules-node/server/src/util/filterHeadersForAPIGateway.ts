import * as http from 'http';
import {APIGatewayProxyResult} from 'aws-lambda';

export const filterHeaderValueForAPIGateway = (
    value: string | Array<string> | number | boolean,
) => {
    if (Array.isArray(value)) {
        return value[0];
    }
    return value;
}

export const filterHeadersForAPIGateway = (
    header: http.IncomingHttpHeaders,
): APIGatewayProxyResult['headers'] => {
    const result: APIGatewayProxyResult['headers'] = {};
    for (const [key, value] of Object.entries(header)) {
        if (typeof value !== 'undefined') {
            result[key] = filterHeaderValueForAPIGateway(value);
        }
    }
    return result;
};
