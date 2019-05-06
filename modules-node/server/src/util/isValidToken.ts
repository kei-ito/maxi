import {IToken} from './types';

export const isValidToken = (
    value: IToken,
): value is (string | number) => {
    const type = typeof value;
    return type === 'string' || type === 'number';
};
