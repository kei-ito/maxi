import * as catalog from '@maxi-js/catalog';
import {IHandler} from './util/types';
import {createHandler} from './util/createHandler';

export const respondSitemapXML: IHandler = async () => ({
    statusCode: 200,
    headers: {
        'content-type': 'text/xml; charset=utf-8',
        'cache-control': 'max-age=43200, public',
    },
    body: [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
        '<url><loc>https://maxi.wemo.me/</loc></url>',
        ...Array.from(catalog.map).map(([, object]) => `<url><loc>https://maxi.wemo.me/objects/${object.id}</loc></url>`),
        '</urlset>',
        '',
    ].join('\n'),
});

export const handler = createHandler(respondSitemapXML);
