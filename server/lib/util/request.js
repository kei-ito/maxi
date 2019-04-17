"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const url_1 = require("url");
const http = require("http");
const https = require("https");
exports.ensureURL = (urlOrString) => typeof urlOrString === 'string' ? new url_1.URL(urlOrString) : urlOrString;
exports.getResponse = (url, options) => new Promise((resolve, reject) => {
    const httpRequest = (url.protocol === 'http:' ? http : https).request(Object.assign({}, options, { protocol: url.protocol, host: url.host, port: url.port, path: url.pathname, auth: `${url.username}:${url.password}` }));
    httpRequest.once('error', reject);
    httpRequest.once('response', resolve);
    httpRequest.end();
});
exports.request = async (urlOrString, reader, options = {}) => {
    const url = exports.ensureURL(urlOrString);
    const response = await exports.getResponse(url, options);
    const body = await reader(response);
    return Object.assign(response, { body });
};
//# sourceMappingURL=request.js.map