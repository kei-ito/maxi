"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("./util");
const indexHandler = async (_event, _context) => {
    const response = await util_1.get('http://maxi.riken.jp/pubdata/v3/');
    const body = `[\n${util_1.getMatchedString(response.body, /<tr[^>]*>([\s\S]*?)<\/tr>/g)
        .slice(1)
        .map((rowHTML) => {
        const cells = util_1.getMatchedString(rowHTML, /<t[dh][^>]*>([\s\S]*?)<\/t[dh]>/g);
        const names = util_1.getMatchedString(cells[1], /href="([\w+-]*?)\/[^>]*>([^<]*?)</g);
        cells[0] = names[0];
        cells[1] = names[1];
        return JSON.stringify(cells);
    })
        .join(',\n')}\n]`;
    return {
        statusCode: 200,
        headers: {
            ...util_1.filterHeaders(response.headers),
            'content-length': body.length,
            'content-type': 'application/json; charset=utf-8',
        },
        body,
    };
};
const objectHandler = async (event, _context) => {
    const objectId = event.pathParameters && event.pathParameters.id;
    if (!objectId) {
        return {
            statusCode: 404,
            body: '',
        };
    }
    const baseURL = `http://maxi.riken.jp/star_data/${objectId}/`;
    const response1 = await util_1.get(`${baseURL}/${objectId}.html`);
    const regexp = new RegExp(`="(${objectId.replace(/[^\w]/g, '\\$&')}\\w*?1day_all\\.dat)"`, 'g');
    const [dataFileName] = util_1.getMatchedString(response1.body, regexp);
    const response2 = await util_1.get(`${baseURL}/${dataFileName}`);
    return {
        statusCode: 200,
        headers: {
            'content-type': 'application/json; charset=utf-8',
        },
        body: util_1.csvToJSON(response2.body),
    };
};
Object.assign(exports, {
    indexHandler,
    objectHandler,
});
//# sourceMappingURL=index.js.map