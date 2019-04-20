"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const url_1 = require("url");
const request_1 = require("./util/request");
const streamReader_1 = require("./util/streamReader");
const getMatchedStrings_1 = require("./util/getMatchedStrings");
const filterHeadersForAPIGateway_1 = require("./util/filterHeadersForAPIGateway");
const getTableFromHTML_1 = require("./util/getTableFromHTML");
const stringifyTable_1 = require("./util/stringifyTable");
const createErrorResponse_1 = require("./util/createErrorResponse");
const generateCommonHeaders_1 = require("./util/generateCommonHeaders");
const getTitleFromHTML_1 = require("./util/getTitleFromHTML");
const removeHeading = (table) => table.slice(1);
const fillIdAndName = (row) => {
    const [id, name] = getMatchedStrings_1.getMatchedStrings(row[1], /href="([\w+-]*?)\/[^>]*>([^<]*?)</g);
    return [
        id,
        name,
        row[6],
        row[2],
        row[3],
        row[4],
        row[5],
    ];
};
exports.handler = async (event, context) => {
    const sourceURL = new url_1.URL('http://maxi.riken.jp/pubdata/v3/');
    const response = await request_1.request(sourceURL, streamReader_1.asString);
    if (response.statusCode !== 200) {
        return createErrorResponse_1.createErrorResponse(response);
    }
    const [table] = getTableFromHTML_1.getTableFromHTML(response.body);
    if (!table) {
        throw new Error(`Failed to parse source table: ${response.body}`);
    }
    const body = stringifyTable_1.stringifyTable(removeHeading(table).map(fillIdAndName));
    return {
        statusCode: 200,
        headers: Object.assign({}, filterHeadersForAPIGateway_1.filterHeadersForAPIGateway(response.headers), generateCommonHeaders_1.generateCommonHeaders(event, context, {
            'x-source-title': getTitleFromHTML_1.getTitleFromHTML(response.body),
            'x-source-url': `${sourceURL}`,
        }), { 'content-length': body.length, 'content-type': 'application/json; charset=utf-8', 'cache-control': 'max-age=43200' }),
        body,
    };
};
//# sourceMappingURL=index.js.map