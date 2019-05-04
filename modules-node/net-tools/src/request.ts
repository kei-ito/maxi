import {URL} from 'url';
import * as http from 'http';
import * as https from 'https';
import {IStreamReader} from '@maxi-js/stream-tools';
import {IIncomingMessageWithBody, IRequestOptions} from './types';
let counter = 0;

export const ensureURL = (
    urlOrString: string | URL,
): URL => typeof urlOrString === 'string' ? new URL(urlOrString) : urlOrString;

export const filterHostname = (
    hostname: string,
): string => hostname.replace(/^\[(.*?)\]$/, '$1');

export const getResponse = (
    url: URL,
    options: IRequestOptions,
): Promise<http.IncomingMessage> => new Promise((resolve, reject) => {
    const requestId = `${++counter}`.padStart(4);
    const {stdout} = options;
    const family = url.hostname.includes(':') ? 6 : 4;
    const parameters = {
        ...options,
        family,
        protocol: url.protocol,
        host: filterHostname(url.hostname),
        port: url.port,
        path: url.pathname,
        auth: `${url.username}:${url.password}`,
    };
    delete parameters.stdout;
    const httpRequest = (url.protocol === 'http:' ? http : https).request(parameters);
    httpRequest.once('error', reject)
    httpRequest.once('response', (response: http.IncomingMessage) => {
        if (stdout) {
            stdout.write(`${requestId}: ${response.statusCode} ${response.statusMessage}\n`);
        }
        resolve(response);
    });
    httpRequest.end();
    if (stdout) {
        stdout.write(`${requestId}: ${parameters.method || 'GET'} ${url}\n`);
    }
});

export const request = async (
    urlOrString: string | URL,
    reader: IStreamReader,
    options: IRequestOptions = {},
): Promise<IIncomingMessageWithBody> => {
    const url = ensureURL(urlOrString);
    const response = await getResponse(url, options);
    const body = await reader(response);
    return Object.assign(response, {body});
};
