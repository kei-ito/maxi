import {APIBaseURL} from './constants';
import {createError} from './createError';
import {ILightCurveData, ILightCurveBin} from '../types';
import {extractResponseData} from './extractResponseData';

export const getLightCurveData = async (
    objectId: string,
): Promise<ILightCurveData> => {
    const response = await fetch(`${new URL(`objects/${objectId}/flux`, APIBaseURL)}`);
    if (response.status !== 200) {
        throw createError(
            'FETCH_OBJECT_DATA',
            'failed to fetch object data',
            response,
        );
    }
    const data = await response.json() as Array<ILightCurveBin>;
    return Object.assign(data, extractResponseData(response));
};
