import {APIBaseURL} from './constants';
import {createError} from './createError';
import {IObject, IObjectSource, IObjectMap} from '../types';
import {normalizeSearchText} from './normalizeSearchText';
import {extractResponseData} from './extractResponseData';

export const getObjectMap = async (): Promise<IObjectMap> => {
    const response = await fetch(`${new URL('objects', APIBaseURL)}`);
    if (response.status !== 200) {
        throw createError(
            'FETCH_OBJECTS',
            'failed to fetch objects',
            response,
        );
    }
    const rawSourceList = await response.json() as Array<IObjectSource>;
    const objects = new Map<string, IObject>();
    for (const rawSource of rawSourceList) {
        const [id, name, category, RA, Dec, L, B] = rawSource;
        objects.set(id, {
            id,
            name,
            category,
            RA: Number(RA),
            Dec: Number(Dec),
            L: Number(L),
            B: Number(B),
            hash: normalizeSearchText(rawSource.join('')),
        });
    }
    return Object.assign(objects, extractResponseData(response));
};
