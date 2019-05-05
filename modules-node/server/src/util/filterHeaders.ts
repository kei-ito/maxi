import {APIGatewayProxyResult} from 'aws-lambda';
import {IHeaderValue, IHeader} from './types';

export interface IHeaders {
    headers: APIGatewayProxyResult['headers'],
    multiValueHeaders: APIGatewayProxyResult['multiValueHeaders'],
}

export const isValidHeaderValue = (
    value: IHeaderValue,
): value is (string | number) => {
    const type = typeof value;
    return type === 'string' || type === 'number';
}

export const filterHeaders = (
    header: IHeader,
): IHeaders => {
    const headers: APIGatewayProxyResult['headers'] = {};
    const multiValueHeaders: APIGatewayProxyResult['multiValueHeaders'] = {};
    for (const [key, value] of Object.entries(header)) {
        const values = (Array.isArray(value) ? value : [value]).filter(isValidHeaderValue);
        if (1 < values.length) {
            multiValueHeaders[key] = values;
        } else if (values.length === 1) {
            headers[key] = values[0];
        }
    }
    return {
        headers,
        multiValueHeaders,
    };
};
