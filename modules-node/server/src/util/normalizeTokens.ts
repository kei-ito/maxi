import {ensureArray} from '@maxi-js/object-tools';
import {ITokenListMap, ITokenMap} from './types';
import {isValidToken} from './isValidToken';

export const normalizeTokens = (...tokenLists: Array<ITokenMap | ITokenListMap | null | undefined>): ITokenListMap => tokenLists.reduce<ITokenListMap>(
    (list, tokens) => {
        if (tokens) {
            Object.keys(tokens).forEach((name) => {
                const value = ensureArray(tokens[name]).filter(isValidToken);
                if (0 < value.length) {
                    list[name.toLowerCase()] = value;
                }
            });
        }
        return list;
    },
    {},
);
