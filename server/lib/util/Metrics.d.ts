/// <reference types="node" />
import { ClientRequest } from 'http';
import { APIGatewayProxyEvent } from 'aws-lambda';
export interface IMetrics {
    createdAt: number;
    processCount: number;
    processMap: WeakMap<NodeJS.Process, IProcessMetrics>;
}
export declare const createMetrics: (createdAt?: number) => IMetrics;
export interface IProcessMetrics {
    createdAt: number;
    functionCount: number;
    functionMap: WeakMap<APIGatewayProxyEvent, IFunctionMetrics>;
}
export declare const createProcessMetrics: (process: NodeJS.Process, createdAt?: number) => IProcessMetrics;
export interface IFunctionMetrics {
    createdAt: number;
    startedAt: number | null;
    endedAt: number | null;
    httpRequests: Array<IHTTPRequestMetrics>;
    httpRequestMap: WeakMap<ClientRequest, IHTTPRequestMetrics>;
}
export interface IHTTPRequestMetrics {
    createdAt: number;
    startedAt: number | null;
    endedAt: number | null;
    respondedAt: number | null;
    finishedAt: number | null;
}
export declare const createFunctionMetrics: (createdAt?: number) => IFunctionMetrics;
export declare const createHTTPRequestMetrics: (createdAt?: number) => IHTTPRequestMetrics;
export declare class Metrics {
    onStarted(): void;
    onEnded(): void;
    onHTTPRequestCreated(request: ClientRequest): void;
    onHTTPRequestEnded(request: ClientRequest): void;
    onHTTPRequestResponded(request: ClientRequest): void;
    onHTTPRequestFinished(request: ClientRequest): void;
    protected getHTTPRequestMetrics(request: ClientRequest): IHTTPRequestMetrics;
    protected setHTTPRequestMetrics(request: ClientRequest, key: keyof IHTTPRequestMetrics): void;
}
