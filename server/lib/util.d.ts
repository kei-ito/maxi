/// <reference types="node" />
import { URL } from 'url';
import * as http from 'http';
import * as stream from 'stream';
export declare const readAsString: (readable: stream.Readable) => Promise<string>;
export declare const getResponse: (url: URL) => Promise<http.IncomingMessage>;
export declare const get: (urlOrString: string) => Promise<http.IncomingMessage & {
    body: string;
}>;
export declare const filterHeaderValue: (value: string | number | boolean | string[]) => string | number | boolean;
export declare const filterHeaders: (header: http.IncomingHttpHeaders) => {
    [header: string]: string | number | boolean;
} | undefined;
export declare const getMatchedString: (input: string, regexp: RegExp) => string[];
export declare const csvToJSON: (input: string) => string;
