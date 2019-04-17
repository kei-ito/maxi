"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const filterHeadersForAPIGateway_1 = require("./filterHeadersForAPIGateway");
exports.createErrorResponse = (response) => ({
    statusCode: response.statusCode || 500,
    headers: Object.assign({}, filterHeadersForAPIGateway_1.filterHeadersForAPIGateway(response.headers), { 'content-length': 0 }),
    body: '',
});
//# sourceMappingURL=createErrorResponse.js.map