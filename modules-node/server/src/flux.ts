import {APIGatewayProxyHandler} from 'aws-lambda';
import {request} from '@maxi-js/net-tools';
import {asString} from '@maxi-js/stream-tools';
import {catalog} from '@maxi-js/catalog';
import {stringifyTable, ssv2js} from '@maxi-js/string-tools';
import {filterHeadersForAPIGateway} from './filterHeadersForAPIGateway';
import {createErrorResponse} from './createErrorResponse';
import {generateCommonHeaders} from './generateCommonHeaders';

export const handler: APIGatewayProxyHandler = async (event, context) => {
    const objectId = event.pathParameters && event.pathParameters.objectId;
    if (!objectId) {
        return {
            statusCode: 400,
            body: `The requested objectId (${objectId}) is invalid`,
        };
    }
    const object = catalog.list.find((object) => object.id === objectId);
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
        headers: {
            ...filterHeadersForAPIGateway(response.headers),
            ...generateCommonHeaders(event, context, {
                'x-source-title': object.source.title,
                'x-source-url': object.source.urls.html,
            }),
            'content-length': body.length,
            'content-type': 'application/json; charset=utf-8',
            'cache-control': 'max-age=43200',
        },
        body,
    };
};
