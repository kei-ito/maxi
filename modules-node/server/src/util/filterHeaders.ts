import {APIGatewayProxyResult} from 'aws-lambda';
import {IHeaderValue, IHeader} from './types';

export const isValidHeaderValue = (
    value: IHeaderValue,
): value is (string | number) => {
    const type = typeof value;
    return type === 'string' || type === 'number';
}

export const filterHeaders = (
    header: IHeader,
): APIGatewayProxyResult['multiValueHeaders'] => {
    const result: APIGatewayProxyResult['multiValueHeaders'] = {};
    for (const [key, value] of Object.entries(header)) {
        const values = (Array.isArray(value) ? value : [value]).filter(isValidHeaderValue);
        if (0 < values.length) {
            result[key] = values;
        }
    }
    return result;
};
