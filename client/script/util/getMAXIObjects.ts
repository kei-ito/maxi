import {APIBaseURL} from './constants';
import {createError} from './createError';
import {IMAXIObject, IMAXIObjectSource} from '../types';

export const getMAXIObjects = async (): Promise<Array<IMAXIObject>> => {
    const response = await fetch(`${APIBaseURL}`);
    if (response.status !== 200) {
        throw createError(
            'FETCH_OBJECTS',
            'failed to fetch objects',
            response,
        );
    }
    const objects = await response.json() as Array<IMAXIObjectSource>;
    return objects.map<IMAXIObject>((params) => {
        const [id, name, category, RA, Dec, L, B] = params;
        return {
            id,
            name,
            category,
            RA: Number(RA),
            Dec: Number(Dec),
            L: Number(L),
            B: Number(B),
            hash: params.join(',').toLowerCase(),
        };
    });
};
