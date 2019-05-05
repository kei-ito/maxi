import {nearest} from '@maxi-js/number-tools';
import {ITickData} from '../types';

export const getTickScale = (
    min: number,
    max: number,
    numberOfTicks: number,
    units: Array<number>,
    base: number = 10,
): ITickData | null => {
    const range = max - min;
    if (0 < range) {
        const subScale = base ** Math.floor((Math.log(range) / Math.log(base)) - 1);
        const step = nearest(
            units,
            range / numberOfTicks / subScale,
        );
        const mainScale = subScale * step;
        const firstSubTick = subScale * Math.ceil(min / subScale);
        const firstMainTick = mainScale * Math.ceil(min / mainScale);
        return {
            step,
            stepOffset: Math.floor((firstMainTick - firstSubTick) / subScale),
            subScale,
            firstSub: firstSubTick,
            mainScale,
            firstMain: firstMainTick,
        };
    }
    return null;
};
