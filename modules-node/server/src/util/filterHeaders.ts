import {APIGatewayProxyResult} from 'aws-lambda';
import {ensureArray} from '@maxi-js/object-tools';
import {IHeader} from './types';
import {isValidToken} from './isValidToken';

export interface IFilteredHeaders {
    headers?: APIGatewayProxyResult['headers'],
    multiValueHeaders?: APIGatewayProxyResult['multiValueHeaders'],
}

export const filterHeaders = (
    header: IHeader,
): IFilteredHeaders => {
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
    return Object.assign(
        {},
        0 < Object.keys(headers).length ? {headers} : null,
        0 < Object.keys(multiValueHeaders).length ? {multiValueHeaders} : null,
    );
};
