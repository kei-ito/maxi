import {APIGatewayProxyResult} from 'aws-lambda';
import {ensureArray} from '@maxi-js/object-tools';
import {IHeader} from './types';
import {isValidToken} from './isValidToken';

export const filterHeaders = (
    header: IHeader,
) => {
    const headers: APIGatewayProxyResult['headers'] = {};
    const multiValueHeaders: APIGatewayProxyResult['multiValueHeaders'] = {};
    for (const key of Object.keys(header)) {
        const values = ensureArray(header[key]).filter(isValidToken);
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
