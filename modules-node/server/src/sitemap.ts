import {APIGatewayProxyHandler} from 'aws-lambda';
import * as catalog from '@maxi-js/catalog';
import {generateCommonHeaders} from './util/generateCommonHeaders';
import {filterHeaders} from './util/filterHeaders';

export const handler: APIGatewayProxyHandler = async (event, context) => {
    const body = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
        '<url><loc>https://maxi.wemo.me/</loc></url>',
        ...Array.from(catalog.map).map(([, object]) => `<url><loc>https://maxi.wemo.me/objects/${object.id}</loc></url>`),
        '</urlset>',
        '',
    ].join('\n');
    return {
        statusCode: 200,
        ...filterHeaders({
            ...generateCommonHeaders(event, context),
            'content-length': [body.length],
            'content-type': 'text/xml; charset=utf-8',
            'cache-control': ['max-age=43200'],
        }),
        body,
    };
};
