import { APIGatewayProxyEvent, Context } from 'aws-lambda';
export declare const generateCommonHeaders: (event: APIGatewayProxyEvent, _context: Context, exposes?: {
    [name: string]: string;
}) => {
    [header: string]: string | number | boolean;
} | undefined;
