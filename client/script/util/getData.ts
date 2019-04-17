import {APIBaseURL} from './constants';
import {createError} from './createError';
import {IMAXIObjectData} from '../types';

export const getData = async (
    objectId: string,
): Promise<IMAXIObjectData> => {
    const response = await fetch(`${new URL(`objects/${objectId}`, APIBaseURL)}`);
    if (response.status !== 200) {
        throw createError(
            'FETCH_OBJECT_DATA',
            'failed to fetch object data',
            response,
        );
    }
    const data = await response.json() as IMAXIObjectData;
    return data;
};
