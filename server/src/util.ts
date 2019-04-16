import {URL} from 'url';
import * as http from 'http';
import * as https from 'https';
import * as stream from 'stream';
import {APIGatewayProxyResult} from 'aws-lambda';

export const readAsString = (
    readable: stream.Readable,
): Promise<string> => new Promise((resolve, reject) => {
    let chunks: Array<Buffer> = [];
    let totalLength = 0;
    const writable = new stream.Writable({
        write(chunk: Buffer, _encoding, callback) {
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

export const getResponse = (
    url: URL,
): Promise<http.IncomingMessage> => new Promise((resolve, reject) => {
    const request = (url.protocol === 'http:' ? http : https).get(url);
    request.once('error', reject)
    request.once('response', resolve);
});

export const get = async (
    urlOrString: string,
): Promise<http.IncomingMessage & {body: string}> => {
    const url = new URL(urlOrString);
    const response = await getResponse(url);
    const body = await readAsString(response);
    return Object.assign(response, {body});
};

export const filterHeaderValue = (
    value: string | Array<string> | number | boolean,
) => {
    if (Array.isArray(value)) {
        return value[0];
    }
    return value;
}

export const filterHeaders = (
    header: http.IncomingHttpHeaders,
): APIGatewayProxyResult['headers'] => {
    const result: APIGatewayProxyResult['headers'] = {};
    for (const [key, value] of Object.entries(header)) {
        if (typeof value !== 'undefined') {
            result[key] = filterHeaderValue(value);
        }
    }
    return result;
};

export const getMatchedString = (
    input: string,
    regexp: RegExp,
): Array<string> => {
    const result: Array<string> = [];
    while (1) {
        const match = regexp.exec(input);
        if (match) {
            for (let index = 1; index < match.length; index++) {
                result.push(match[index].trim());
            }
        } else {
            break;
        }
    }
    return result;
};

export const csvToJSON = (
    input: string,
): string => `[\n${
    input
    .trim()
    .split(/\r\n|\r|\n/)
    .map((line) => JSON.stringify(
        line.trim().split(/\s+/).map(Number),
    ))
    .join(',\n')
}\n]\n`;
