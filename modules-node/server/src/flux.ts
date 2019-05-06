import {request} from '@maxi-js/net-tools';
import {asString} from '@maxi-js/stream-tools';
import * as catalog from '@maxi-js/catalog';
import {stringifyTable, ssv2js} from '@maxi-js/string-tools';
import {createHandler} from './util/createHandler';
import {IHandler} from './util/types';

export const respondFlux: IHandler = async (event) => {
    const objectId = event.pathParameters.objectId;
    if (!objectId) {
        throw Object.assign(
            new Error(`The requested objectId (${objectId}) is invalid`),
            {statusCode: 400},
        );
    }
    const object = catalog.map.get(objectId);
    if (!object) {
        throw Object.assign(
            new Error(`The requested object (${objectId}) is not found`),
            {statusCode: 404},
        );
    }
    const response = await request(object.source.urls.data, asString);
    if (response.statusCode !== 200) {
        throw new Error(`${object.source.urls.data} returns ${response.statusCode} ${response.statusMessage}`);
    }
    const body = Buffer.from(stringifyTable(ssv2js(response.body, Number)));
    return {
        statusCode: 200,
        headers: {
            ...response.headers,
            'content-type': 'application/json; charset=utf-8',
            'cache-control': 'max-age=43200, public',
        },
        exposedHeaders: {
            'x-source-title': object.source.title,
            'x-source-url': object.source.urls.html,
        },
        body,
    };
};

export const handler = createHandler(respondFlux);
