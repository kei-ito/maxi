"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const filterHeadersForAPIGateway_1 = require("./filterHeadersForAPIGateway");
exports.createErrorResponse = (response) => {
    const body = `${response.statusCode} ${response.statusMessage}`;
    console.log(response);
    return {
        statusCode: response.statusCode || 500,
        headers: Object.assign({}, filterHeadersForAPIGateway_1.filterHeadersForAPIGateway(response.headers), { 'content-length': body.length }),
        body,
    };
};
//# sourceMappingURL=createErrorResponse.js.map