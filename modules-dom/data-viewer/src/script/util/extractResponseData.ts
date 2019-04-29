import {IResponseData} from '../types';

export const extractResponseData = (
    response: Response,
): IResponseData => ({
    sourceTitle: response.headers.get('x-source-title'),
    sourceURL: response.headers.get('x-source-url'),
    createdAt: new Date(response.headers.get('x-created-at') || 'Invalid Date'),
    elapsedSeconds: Number(response.headers.get('x-elapsed-seconds')),
});
