import {APIGatewayProxyHandler} from 'aws-lambda';
import {request} from '@maxi-js/net-tools';
import {asString} from '@maxi-js/stream-tools';
import * as catalog from '@maxi-js/catalog';
import {stringifyTable, ssv2js} from '@maxi-js/string-tools';
import {createErrorResponse} from './util/createErrorResponse';
import {generateCommonHeaders} from './util/generateCommonHeaders';
import {filterHeaders} from './util/filterHeaders';

export const handler: APIGatewayProxyHandler = async (event, context) => {
    const objectId = event.pathParameters && event.pathParameters.objectId;
    if (!objectId) {
        return {
            statusCode: 400,
            body: `The requested objectId (${objectId}) is invalid`,
        };
    }
    const object = catalog.map.get(objectId);
    if (!object) {
        return {
            statusCode: 404,
            body: `The requested object (${objectId}) is not found`,
        };
    }
    const response = await request(object.source.urls.data, asString);
    if (response.statusCode !== 200) {
        return createErrorResponse(response);
    }
    const body = stringifyTable(ssv2js(response.body, Number));
    return {
        statusCode: 200,
        ...filterHeaders({
            ...response.headers,
            ...generateCommonHeaders({
                event,
                context,
                body,
                exposedHeaders: {
                    'x-source-title': object.source.title,
                    'x-source-url': object.source.urls.html,
                },
            }),
            'content-type': 'application/json; charset=utf-8',
            'cache-control': 'max-age=43200, public',
        }),
        body,
    };
};
