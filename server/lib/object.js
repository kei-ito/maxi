"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const url_1 = require("url");
const request_1 = require("./util/request");
const streamReader_1 = require("./util/streamReader");
const getMatchedStrings_1 = require("./util/getMatchedStrings");
const filterHeadersForAPIGateway_1 = require("./util/filterHeadersForAPIGateway");
const stringifyTable_1 = require("./util/stringifyTable");
const xsvToJSON_1 = require("./util/xsvToJSON");
const createErrorResponse_1 = require("./util/createErrorResponse");
const generateCommonHeaders_1 = require("./util/generateCommonHeaders");
const getTitleFromHTML_1 = require("./util/getTitleFromHTML");
exports.handler = async (event, context) => {
    const objectId = event.pathParameters && event.pathParameters.objectId;
    if (!objectId) {
        return {
            statusCode: 404,
            body: '',
        };
    }
    const baseURL = new url_1.URL(`http://maxi.riken.jp/star_data/${objectId}/`);
    const sourceURL = new url_1.URL(`${objectId}.html`, baseURL);
    const response1 = await request_1.request(sourceURL, streamReader_1.asString);
    if (response1.statusCode !== 200) {
        return createErrorResponse_1.createErrorResponse(response1);
    }
    const regexp = new RegExp(`="(${objectId.replace(/[^\w]/g, '\\$&')}\\w*?1day_all\\.dat)"`, 'g');
    const [dataFileName] = getMatchedStrings_1.getMatchedStrings(response1.body, regexp);
    const response2 = await request_1.request(new url_1.URL(dataFileName, baseURL), streamReader_1.asString);
    if (response2.statusCode !== 200) {
        return createErrorResponse_1.createErrorResponse(response2);
    }
    const body = stringifyTable_1.stringifyTable(xsvToJSON_1.ssv2js(response2.body, Number));
    return {
        statusCode: 200,
        headers: Object.assign({}, filterHeadersForAPIGateway_1.filterHeadersForAPIGateway(response2.headers), generateCommonHeaders_1.generateCommonHeaders(event, context, {
            'x-source-title': getTitleFromHTML_1.getTitleFromHTML(response1.body),
            'x-source-url': `${sourceURL}`,
        }), { 'content-length': body.length, 'content-type': 'application/json; charset=utf-8', 'cache-control': 'max-age=43200' }),
        body,
    };
};
//# sourceMappingURL=object.js.map