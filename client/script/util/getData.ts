import {APIBaseURL} from './constants';
import {createError} from './createError';
import {IMAXILightCurveData} from '../types';

export const getLightCurveData = async (
    objectId: string,
): Promise<IMAXILightCurveData> => {
    const response = await fetch(`${new URL(`objects/${objectId}`, APIBaseURL)}`);
    if (response.status !== 200) {
        throw createError(
            'FETCH_OBJECT_DATA',
            'failed to fetch object data',
            response,
        );
    }
    const data = await response.json() as IMAXILightCurveData;
    return data;
};
