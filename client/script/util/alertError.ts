import {IError} from '../types';

export const alertError = <TData>(
    error: IError<TData> | Error,
): void => {
    alert(`${error.stack || error.message}`);
};
