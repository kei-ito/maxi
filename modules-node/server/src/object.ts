import {URL} from 'url';
import {APIGatewayProxyHandler} from 'aws-lambda';
import {request} from './util/request';
import {asString} from './util/streamReader';
import {getMatchedStrings} from './util/getMatchedStrings';
import {filterHeadersForAPIGateway} from './util/filterHeadersForAPIGateway';
import {stringifyTable} from './util/stringifyTable';
import {ssv2js} from './util/xsvToJSON';
import {createErrorResponse} from './util/createErrorResponse';
import {generateCommonHeaders} from './util/generateCommonHeaders';
import {getTitleFromHTML} from './util/getTitleFromHTML';

export const handler: APIGatewayProxyHandler = async (event, context) => {
    const objectId = event.pathParameters && event.pathParameters.objectId;
    if (!objectId) {
        return {
            statusCode: 404,
            body: '',
        };
    }
    const baseURL = new URL(`http://maxi.riken.jp/star_data/${objectId}/`);
    const sourceURL = new URL(`${objectId}.html`, baseURL);
    const response1 = await request(sourceURL, asString);
    if (response1.statusCode !== 200) {
        return createErrorResponse(response1);
    }
    const regexp = new RegExp(`="(${objectId.replace(/[^\w]/g, '\\$&')}\\w*?1day_all\\.dat)"`, 'g');
    const [dataFileName] = getMatchedStrings(response1.body, regexp);
    const response2 = await request(new URL(dataFileName, baseURL), asString);
    if (response2.statusCode !== 200) {
        return createErrorResponse(response2);
    }
    const body = stringifyTable(ssv2js(response2.body, Number));
    return {
        statusCode: 200,
        headers: {
            ...filterHeadersForAPIGateway(response2.headers),
            ...generateCommonHeaders(event, context, {
                'x-source-title': getTitleFromHTML(response1.body),
                'x-source-url': `${sourceURL}`,
            }),
            'content-length': body.length,
            'content-type': 'application/json; charset=utf-8',
            'cache-control': 'max-age=43200',
        },
        body,
    };
};
