import {APIGatewayEventRequestContext, Context} from 'aws-lambda';

export type IToken = string | number | null | undefined;

export interface ITokenListMap {
    [name: string]: Array<IToken> | undefined,
}

export interface ITokenMap {
    [name: string]: IToken | undefined,
}

export interface IHeader {
    [name: string]: Array<IToken> | IToken | undefined,
}

export interface IFilledAPIGatewayProxyEvent {
    body: string | null,
    headers: ITokenListMap,
    httpMethod: string,
    isBase64Encoded: boolean,
    path: string,
    pathParameters: {[name: string]: string | undefined},
    queryStringParameters: ITokenListMap,
    stageVariables: {[name: string]: string | undefined},
    requestContext: APIGatewayEventRequestContext,
    resource: string,
}

export interface IHandlerResult {
    statusCode: number,
    headers?: IHeader,
    exposedHeaders?: IHeader,
    body?: Buffer | string | null,
}

export interface IHandler {
    (
        event: IFilledAPIGatewayProxyEvent,
        context: Context,
    ): Promise<IHandlerResult>,
}
