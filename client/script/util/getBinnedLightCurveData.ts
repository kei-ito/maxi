import {ILightCurveBin, IBinnedLightCurveData, IBinnedLightCurveBin} from '../types';
import {getBinId} from './getBinId';

export const accumulateAB = (
    flux: number,
    error: number,
    A: number,
    B: number,
): [number, number] => {
    const s = 1 / (error ** 2);
    return [A + s, B + flux * s];
};

export const getBin = (
    leftMJD: number,
    rightMJD: number,
    A2_20: number,
    B2_20: number,
    A2_4: number,
    B2_4: number,
    A4_10: number,
    B4_10: number,
    A10_20: number,
    B10_20: number,
): IBinnedLightCurveBin => [
    leftMJD || (rightMJD - 1),
    rightMJD,
    B2_20 / A2_20,
    A2_20 ** -0.5,
    B2_4 / A2_4,
    A2_4 ** -0.5,
    B4_10 / A4_10,
    A4_10 ** -0.5,
    B10_20 / A10_20,
    A10_20 ** -0.5,
];

export const getBinnedLightCurveData = async (
    data: Array<ILightCurveBin>,
    binSize: number,
): Promise<IBinnedLightCurveData> => {
    const bins: Array<IBinnedLightCurveBin> = [];
    let minX = Infinity;
    let maxX = 0;
    let minY = Infinity;
    let maxY = 0;
    const addBin = (
        leftMJD: number,
        rightMJD: number,
        A2_20: number,
        B2_20: number,
        A2_4: number,
        B2_4: number,
        A4_10: number,
        B4_10: number,
        A10_20: number,
        B10_20: number,
    ) => {
        const newBin = getBin(leftMJD, rightMJD, A2_20, B2_20, A2_4, B2_4, A4_10, B4_10, A10_20, B10_20);
        minX = Math.min(minX, newBin[0]);
        maxX = Math.max(maxX, newBin[1]);
        minY = Math.min(minY, newBin[2] - newBin[3]);
        maxY = Math.max(maxY, newBin[2] + newBin[3]);
        bins.push(newBin);
    };
    const {length} = data;
    let leftMJD = 0;
    let rightMJD = 0;
    let A2_20 = 0;
    let B2_20 = 0;
    let A2_4 = 0;
    let B2_4 = 0;
    let A4_10 = 0;
    let B4_10 = 0;
    let A10_20 = 0;
    let B10_20 = 0;
    let currentBinId: number = -1;
    for (let index = 1; index < length; index++) {
        const bin = data[index];
        const binId = getBinId(bin[0], binSize);
        if (binId === currentBinId) {
            rightMJD = bin[0] + 0.5;
            [A2_20, B2_20]   = accumulateAB(bin[1], bin[2], A2_20, B2_20);
            [A2_4, B2_4]     = accumulateAB(bin[3], bin[4], A2_4, B2_4);
            [A4_10, B4_10]   = accumulateAB(bin[5], bin[6], A4_10, B4_10);
            [A10_20, B10_20] = accumulateAB(bin[7], bin[8], A10_20, B10_20);
        } else {
            if (0 <= currentBinId) {
                addBin(leftMJD, rightMJD, A2_20, B2_20, A2_4, B2_4, A4_10, B4_10, A10_20, B10_20);
            }
            currentBinId = binId;
            leftMJD = bin[0] - 0.5;
            rightMJD = leftMJD + 1;
            [A2_20, B2_20]   = accumulateAB(bin[1], bin[2], 0, 0);
            [A2_4, B2_4]     = accumulateAB(bin[3], bin[4], 0, 0);
            [A4_10, B4_10]   = accumulateAB(bin[5], bin[6], 0, 0);
            [A10_20, B10_20] = accumulateAB(bin[7], bin[8], 0, 0);
        }
    }
    addBin(leftMJD, rightMJD, A2_20, B2_20, A2_4, B2_4, A4_10, B4_10, A10_20, B10_20);
    return {
        bins,
        minX,
        maxX,
        rangeX: maxX - minX,
        minY,
        maxY,
        rangeY: maxY - minY,
    };
};
