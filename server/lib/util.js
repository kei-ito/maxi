"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const url_1 = require("url");
const http = require("http");
const https = require("https");
const stream = require("stream");
exports.readAsString = (readable) => new Promise((resolve, reject) => {
    let chunks = [];
    let totalLength = 0;
    const writable = new stream.Writable({
        write(chunk, _encoding, callback) {
            chunks.push(chunk);
            totalLength += chunk.length;
            callback();
        },
        final(callback) {
            resolve(Buffer.concat(chunks, totalLength).toString('utf8'));
            callback();
        },
    });
    readable.pipe(writable)
        .once('error', reject);
});
exports.getResponse = (url) => new Promise((resolve, reject) => {
    const request = (url.protocol === 'http:' ? http : https).get(url);
    request.once('error', reject);
    request.once('response', resolve);
});
exports.get = async (urlOrString) => {
    const url = new url_1.URL(urlOrString);
    const response = await exports.getResponse(url);
    const body = await exports.readAsString(response);
    return Object.assign(response, { body });
};
exports.filterHeaderValue = (value) => {
    if (Array.isArray(value)) {
        return value[0];
    }
    return value;
};
exports.filterHeaders = (header) => {
    const result = {};
    for (const [key, value] of Object.entries(header)) {
        if (typeof value !== 'undefined') {
            result[key] = exports.filterHeaderValue(value);
        }
    }
    return result;
};
exports.getMatchedString = (input, regexp) => {
    const result = [];
    while (1) {
        const match = regexp.exec(input);
        if (match) {
            for (let index = 1; index < match.length; index++) {
                result.push(match[index].trim());
            }
        }
        else {
            break;
        }
    }
    return result;
};
exports.csvToJSON = (input) => `[\n${input
    .trim()
    .split(/\r\n|\r|\n/)
    .map((line) => JSON.stringify(line.trim().split(/\s+/).map(Number)))
    .join(',\n')}\n]\n`;
//# sourceMappingURL=util.js.map