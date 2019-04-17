/// <reference types="node" />
import { URL } from 'url';
import * as http from 'http';
import { IStreamReader } from '../types';
export declare const ensureURL: (urlOrString: string | URL) => URL;
export declare const getResponse: (url: URL, options: http.RequestOptions) => Promise<http.IncomingMessage>;
export declare const request: (urlOrString: string | URL, reader: IStreamReader<any>, options?: http.RequestOptions) => Promise<http.IncomingMessage & {
    body: string;
}>;
