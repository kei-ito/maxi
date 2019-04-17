/// <reference types="node" />
import * as http from 'http';
import { APIGatewayProxyResult } from 'aws-lambda';
export declare const createErrorResponse: (response: http.IncomingMessage) => APIGatewayProxyResult;
