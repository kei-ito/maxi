export const getTicks = (
    min: number,
    max: number,
): Array<number> => {
    const result: Array<number> = [];
    const step = 10 ** Math.round(Math.log10(max - min) - 1);
    console.log({min, max, step, start: step * Math.ceil(min / step)});
    for (let value = step * Math.ceil(min / step); value < max; value += step) {
        result.push(value);
    }
    return result;
};
