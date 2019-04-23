import {getTickScale} from './getTickScale';
import {ITicks} from '../types';

export const getTicks = (
    min: number,
    max: number,
    numberOfTicks: number,
): ITicks | null => {
    const tickData = getTickScale(min, max, numberOfTicks, [1, 2, 5]);
    if (tickData) {
        const main: Array<number> = [];
        for (let value = tickData.firstMain; value < max; value += tickData.mainScale) {
            main.push(value);
        }
        const sub: Array<number> = [];
        for (let value = tickData.firstSub; value < max; value += tickData.subScale) {
            sub.push(value);
        }
        return {
            step: tickData.step,
            stepOffset: tickData.stepOffset,
            main,
            sub,
        };
    }
    return null;
};
