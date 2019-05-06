import * as fs from 'fs';
import {URL} from 'url';
import {APIGatewayProxyHandler} from 'aws-lambda';
import {generateCommonHeaders} from './util/generateCommonHeaders';
import * as catalog from '@maxi-js/catalog';
import {sanitizeHTMLAttribute} from '@maxi-js/string-tools';
import {cdnBaseURL, viewerBaseURL, baseTitle, developMode, siteImageURL} from './util/constants';
import {filterHeaders} from './util/filterHeaders';

export const appHTMLPromise = new Promise<string>((resolve, reject) => {
    const appHTMLPath = '/opt/nodejs/node_modules/@maxi-js/data-viewer/output/index.html';
    fs.readFile(appHTMLPath, 'utf8', (error, appHTML) => {
        if (error) {
            reject(error);
        } else {
            resolve(appHTML);
        }
    });
});

export const getObjectsFromPath = (
    path: string,
): Array<catalog.IObjectData> => {
    const matched = path.match(/^\/objects\/([^/]+)$/);
    let list: Array<catalog.IObjectData> = [];
    if (matched) {
        for (const objectId of matched[1].split(/\s*,\s*/)) {
            const object = catalog.map.get(objectId);
            if (object) {
                list.push(object);
            }
        }
    }
    return list;
};

export const handler: APIGatewayProxyHandler = async (event, context) => {
    const objects = getObjectsFromPath(event.path);
    const url = new URL(
        0 < objects.length ? `/objects/${objects.map((object) => object.id).join(',')}` : '/',
        viewerBaseURL,
    );
    const imageURL = 0 < objects.length
    ? objects[0].source.urls.image
    : siteImageURL;
    const imageURLAlt = 0 < objects.length
    ? `Light curve of ${objects[0].name}.`
    : '';
    const description = sanitizeHTMLAttribute(
        0 < objects.length
        ? `Light curve of ${objects.map((object) => object.name).join(', ')} observed by MAXI GSC.`
        : 'A graphical interface for visualizing MAXI GSC measurement data.',
    );
    const title = sanitizeHTMLAttribute(
        0 < objects.length
        ? `${objects.map((object) => object.name).join(', ')} | ${baseTitle}`
        : baseTitle,
    );
    const base = developMode ? new URL(`http://${event.headers.Host.split(':')[0]}:1234/`) : new URL('/data-viewer/', cdnBaseURL);
    const body = [
        '<!doctype html>',
        `<html prefix="og: http://ogp.me/ns#"${developMode ? ' data-develop-mode="1"' : ''}>`,
        `<base href="${base}">`,
        '<meta property="og:type" content="website">',
        `<meta property="og:title" content="${title}">`,
        `<meta property="og:description" content="${description}">`,
        `<meta property="og:image" content="${imageURL}">`,
        `<meta property="og:image:alt" content="${imageURLAlt}">`,
        '<meta name="twitter:creator:id" content="@wemotter">',
        `<title>${title}</title>`,
        `<link rel="canonical" href="${url}">`,
        ...(await appHTMLPromise).split(/\s*<!doctype[^>]*>\s*/),
        '</html>',
    ]
    .join('\n');
    return {
        statusCode: 200,
        ...filterHeaders({
            ...generateCommonHeaders(event, context),
            'content-length': body.length,
            'content-type': 'text/html; charset=utf-8',
            'cache-control': 'max-age=43200',
        }),
        body,
    };
};
