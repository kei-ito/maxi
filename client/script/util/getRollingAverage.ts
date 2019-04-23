import {ILightCurveBin, IWindowEntry, IWindowSum, IRollingAverageData, IRollingAverageBin} from '../types';

export const getAB = (
    flux: number,
    error: number,
) => {
    const s = 1 / (error ** 2);
    return [s, flux * s];
};

export const getRollingAverageBin = (
    mjd: number,
    windowStartMJD: number,
    windowEndMJD: number,
    [
        A2_20,
        B2_20,
        A2_4,
        B2_4,
        A4_10,
        B4_10,
        A10_20,
        B10_20,
    ]: IWindowSum,
): IRollingAverageBin => [
    mjd,
    windowStartMJD - 0.5,
    windowEndMJD + 0.5,
    B2_20 / A2_20,
    A2_20 ** -0.5,
    B2_4 / A2_4,
    A2_4 ** -0.5,
    B4_10 / A4_10,
    A4_10 ** -0.5,
    B10_20 / A10_20,
    A10_20 ** -0.5,
];

export const getRollingAverage = async (
    data: Array<ILightCurveBin>,
    binSize: number,
): Promise<IRollingAverageData> => {
    const bins: Array<IRollingAverageBin> = [];
    const minY: [number, number, number, number] = [Infinity, Infinity, Infinity, Infinity];
    const maxY: [number, number, number, number] = [0, 0, 0, 0];
    const window: Array<IWindowEntry> = [];
    const sum: IWindowSum = [0, 0, 0, 0, 0, 0, 0, 0];
    const addEntryToWindow = (
        bin: ILightCurveBin,
    ) => {
        const mjd = bin[0];
        const [A2_20, B2_20]   = getAB(bin[1], bin[2]);
        const [A2_4, B2_4]     = getAB(bin[3], bin[4]);
        const [A4_10, B4_10]   = getAB(bin[5], bin[6]);
        const [A10_20, B10_20] = getAB(bin[7], bin[8]);
        const entry: IWindowEntry = [mjd, A2_20, B2_20, A2_4, B2_4, A4_10, B4_10, A10_20, B10_20];
        window.push(entry);
        sum.forEach((value, index) => {
            sum[index] = value + entry[index + 1];
        });
    };
    const shiftEntryFromWindow = () => {
        const entry = window.shift();
        if (entry) {
            sum.forEach((value, index) => {
                sum[index] = value - entry[index + 1];
            });
        }
    };
    const mjdOffset = binSize / 2;
    const length = data.length;
    let windowEndIndex = 0;
    for (let index = 0; index < length; index++) {
        const mjd = data[index][0];
        const windowEndMJD = mjd + mjdOffset;
        while (windowEndIndex < length) {
            const nextBin = data[windowEndIndex];
            if (nextBin && nextBin[0] < windowEndMJD) {
                addEntryToWindow(nextBin);
                windowEndIndex++;
            } else {
                break;
            }
        }
        const windowStartMJD = mjd - mjdOffset;
        while (window[0][0] < windowStartMJD) {
            shiftEntryFromWindow();
        }
        const averageBin = getRollingAverageBin(
            mjd,
            window[0][0],
            window[window.length - 1][0],
            sum,
        );
        for (let index = 0; index < 4; index++) {
            const fluxIndex = index * 2 + 3;
            const flux = averageBin[fluxIndex];
            const error = averageBin[fluxIndex + 1];
            minY[index] = Math.min(minY[index], flux - error);
            maxY[index] = Math.max(maxY[index], flux + error);
        }
        bins.push(averageBin);
    }
    const minX = data[0][0];
    const maxX = data[data.length - 1][0];
    return {
        bins,
        minX,
        maxX,
        rangeX: maxX - minX,
        minY,
        maxY,
        rangeY: [
            maxY[0] - minY[0],
            maxY[1] - minY[1],
            maxY[2] - minY[2],
            maxY[3] - minY[3],
        ],
    };
};
