/// <reference types="node" />
import * as http from 'http';
export declare const filterHeaderValueForAPIGateway: (value: string | number | boolean | string[]) => string | number | boolean;
export declare const filterHeadersForAPIGateway: (header: http.IncomingHttpHeaders) => {
    [header: string]: string | number | boolean;
} | undefined;
