import {IPreferences} from '../types';
import {clamp} from './clamp';
import {URLParameterKey, epochMJD, nowMJD} from './constants';

export const filterBinSize = (
    binSize: string | number | null,
) => clamp((binSize && Math.round(Number(binSize))) || 7, 1, 100);

export const filterMinMJD = (
    min: string | number | null,
) => clamp((min && Math.round(Number(min))) || epochMJD, epochMJD, nowMJD);

export const filterMaxMJD = (
    max: string | number | null,
) => clamp((max && Math.round(Number(max))) || nowMJD, epochMJD, nowMJD);

export const getDefaultPreferences = (): IPreferences => {
    const searchParameters = new URLSearchParams(location.search);
    const binSize = filterBinSize(searchParameters.get(URLParameterKey.binSize));
    const minMJD = filterMinMJD(searchParameters.get(URLParameterKey.minMJD));
    const maxMJD = filterMaxMJD(searchParameters.get(URLParameterKey.maxMJD));
    return {
        binSize,
        minMJD,
        maxMJD,
    };
};
