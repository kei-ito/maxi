import {IPreferences, IFont} from '../types';
import {clamp} from './clamp';
import {URLParameterKey, AvailableFonts} from './constants';
import {isAvailableFont} from './isAvailableFont';

export const filterBinSize = (
    binSize: string | number | null,
) => clamp((binSize && Math.round(Number(binSize))) || 7, 1, 30);

export const filterFont = (
    font: string | null,
): IFont => {
    if (font && isAvailableFont(font)) {
        return font;
    }
    return AvailableFonts[0];
};

export const filterScale = (
    scale: string | number | null,
) => clamp((scale && Number(scale)) || 1, 1, 10);

export const getDefaultPreferences = (): IPreferences => {
    const searchParameters = new URLSearchParams(location.search);
    return {
        binSize: filterBinSize(searchParameters.get(URLParameterKey.binSize)),
        font: filterFont(searchParameters.get(URLParameterKey.font)),
        scale: filterScale(searchParameters.get(URLParameterKey.scale)),
    };
};
