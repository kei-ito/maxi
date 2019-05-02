import {IError} from '../types';

export const createError = <TData>(
    code: string,
    message: string,
    data: TData,
): IError<TData> => Object.assign(
    new Error(message),
    {code, data},
);
