import {APIGatewayProxyHandler} from 'aws-lambda';
import {get, filterHeaders, getMatchedString, csvToJSON} from './util';

const indexHandler: APIGatewayProxyHandler = async (_event, _context) => {
    const response = await get('http://maxi.riken.jp/pubdata/v3/');
    const body = `[\n${getMatchedString(
        response.body,
        /<tr[^>]*>([\s\S]*?)<\/tr>/g,
    )
    .slice(1)
    .map((rowHTML) => {
        const cells = getMatchedString(
            rowHTML,
            /<t[dh][^>]*>([\s\S]*?)<\/t[dh]>/g,
        );
        const names = getMatchedString(
            cells[1],
            /href="([\w+-]*?)\/[^>]*>([^<]*?)</g,
        );
        cells[0] = names[0];
        cells[1] = names[1];
        return JSON.stringify(cells);
    })
    .join(',\n')}\n]`;
    return {
        statusCode: 200,
        headers: {
            ...filterHeaders(response.headers),
            'content-length': body.length,
            'content-type': 'application/json; charset=utf-8',
        },
        body,
    };
};

const objectHandler: APIGatewayProxyHandler = async (event, _context) => {
    const objectId = event.pathParameters && event.pathParameters.id;
    if (!objectId) {
        return {
            statusCode: 404,
            body: '',
        };
    }
    const baseURL = `http://maxi.riken.jp/star_data/${objectId}/`;
    const response1 = await get(`${baseURL}/${objectId}.html`);
    const regexp = new RegExp(`="(${objectId.replace(/[^\w]/g, '\\$&')}\\w*?1day_all\\.dat)"`, 'g');
    const [dataFileName] = getMatchedString(response1.body, regexp);
    const response2 = await get(`${baseURL}/${dataFileName}`);
    return {
        statusCode: 200,
        headers: {
            // ...filterHeaders(response.headers),
            // 'content-length': body.length,
            'content-type': 'application/json; charset=utf-8',
        },
        body: csvToJSON(response2.body),
    };
};

Object.assign(exports, {
    indexHandler,
    objectHandler,
});
