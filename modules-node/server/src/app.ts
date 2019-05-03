import * as fs from 'fs';
import {APIGatewayProxyHandler} from 'aws-lambda';
import {generateCommonHeaders} from './generateCommonHeaders';
import {cdnDomain} from './constants';

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

export const handler: APIGatewayProxyHandler = async (event, context) => {
    const developMode = event.headers.Host.includes(':');
    const base = developMode ? `http://${event.headers.Host.split(':')[0]}:1234/` : `https://${cdnDomain}/`;
    const body = [
        '<!doctype html>',
        `<base href="${base}">`,
        ...(await appHTMLPromise).split(/\s*<!doctype[^>]*>\s*/),
    ].join('\n');
    return {
        statusCode: 200,
        headers: {
            ...generateCommonHeaders(event, context),
            'content-length': body.length,
            'content-type': 'text/html; charset=utf-8',
            'cache-control': 'max-age=43200',
        },
        body,
    };
};
