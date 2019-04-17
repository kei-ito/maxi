import { APIGatewayProxyEvent } from 'aws-lambda';
export declare const generateCORSHeaders: (event: APIGatewayProxyEvent) => {
    [header: string]: string | number | boolean;
} | undefined;
