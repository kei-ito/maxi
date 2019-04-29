import {IPreferences, IMJDRange, PlotType} from '../types';
import {clamp} from './clamp';
import {URLParameterKey, epochMJD, nowMJD} from './constants';
import {isAvailablePlotType} from './isAvailablePlotType';

export const filterBinSize = (
    binSize: string | number | null,
) => clamp((binSize && Math.round(Number(binSize))) || 20, 1, 100);

export const filterMJDRange = (
    mjdRangeStringOrArray: string | IMJDRange | null,
): IMJDRange => {
    const result: IMJDRange = [epochMJD, nowMJD];
    if (typeof mjdRangeStringOrArray === 'string') {
        const matched = mjdRangeStringOrArray.match(/\d+(\.\d+)?/g);
        if (matched && matched.length === 2) {
            result[0] = clamp(Number(matched[0]), result[0], result[1] - 1);
            result[1] = clamp(Number(matched[1]), result[0] + 1, result[1]);
        }
    } else if (Array.isArray(mjdRangeStringOrArray)) {
        result[0] = clamp(Number(mjdRangeStringOrArray[0]), result[0], result[1] - 1);
        result[1] = clamp(Number(mjdRangeStringOrArray[1]), result[0] + 1, result[1]);
    }
    return result;
};

export const filterPlotType = (
    plot: string | number | null,
): PlotType => isAvailablePlotType(plot) ? plot : PlotType.Line;

export const getDefaultPreferences = (
    searchParameters: URLSearchParams,
): IPreferences => ({
    binSize: filterBinSize(searchParameters.get(URLParameterKey.binSize)),
    mjdRange: filterMJDRange(searchParameters.get(URLParameterKey.mjdRange)),
    plotType: filterPlotType(searchParameters.get(URLParameterKey.plotType)),
});
