import {Context} from 'aws-lambda';
import {IFilledAPIGatewayProxyEvent, IHandler, IHandlerResult} from './types';

export const callHandler = (
    handler: IHandler,
    event: IFilledAPIGatewayProxyEvent,
    context: Context,
): Promise<IHandlerResult> => handler(event, context)
.catch((error: Error & {statusCode?: number}) => ({
    statusCode: error.statusCode || 500,
    body: error.message,
}));
