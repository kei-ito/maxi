import {URL} from 'url';
import * as http from 'http';
import * as https from 'https';
import {IStreamReader} from '../types';

export const ensureURL = (
    urlOrString: string | URL,
): URL => typeof urlOrString === 'string' ? new URL(urlOrString) : urlOrString;

export const getResponse = (
    url: URL,
    options: http.RequestOptions,
): Promise<http.IncomingMessage> => new Promise((resolve, reject) => {
    const httpRequest = (url.protocol === 'http:' ? http : https).request({
        ...options,
        protocol: url.protocol,
        host: url.host,
        port: url.port,
        path: url.pathname,
        auth: `${url.username}:${url.password}`,
    });
    httpRequest.once('error', reject)
    httpRequest.once('response', resolve);
    httpRequest.end();
});

export const request = async (
    urlOrString: string | URL,
    reader: IStreamReader,
    options: http.RequestOptions = {},
): Promise<http.IncomingMessage & {body: string}> => {
    const url = ensureURL(urlOrString);
    const response = await getResponse(url, options);
    const body = await reader(response);
    return Object.assign(response, {body});
};
