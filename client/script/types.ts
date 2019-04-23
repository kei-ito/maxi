export interface IError<TData = any> extends Error {
    code: string,
    data: TData,
}

export interface IForEachable<TValue, TKey = string | number> {
    forEach: (fn: (value: TValue, key: TKey) => void) => void,
}

export type IObjectSource = [
    string,
    string,
    string,
    string,
    string,
    string,
    string,
];

export interface IObject {
    id: string,
    name: string,
    category: string,
    /** Right Ascension (Equatorial coordinate system) */
    RA: number,
    /** Declination (Equatorial coordinate system) */
    Dec: number,
    /** Galactic longitude (Galactic coordinate system) */
    L: number,
    /** Galactic latitude (Galactic coordinate system) */
    B: number,
    hash: string,
}

export interface IResponseData {
    sourceTitle: string | null,
    sourceURL: string | null,
    createdAt: Date,
    elapsedSeconds: number,
}

export interface IObjectMap extends Map<string, IObject>, IResponseData {}

export type ILightCurveBin = [
    number, // MJD
    number, // Flux  (2-20keV)
    number, // Error (2-20keV)
    number, // Flux  (2-4keV)
    number, // Error (2-4keV)
    number, // Flux  (4-10keV)
    number, // Error (4-10keV)
    number, // Flux  (10-20keV)
    number, // Error (10-20keV)
];

export interface ILightCurveData extends Array<ILightCurveBin>, IResponseData {}

export type IWindowEntry = [
    number, // MJD
    number, // A  (2-20keV)
    number, // B (2-20keV)
    number, // A  (2-4keV)
    number, // B (2-4keV)
    number, // A  (4-10keV)
    number, // B (4-10keV)
    number, // A  (10-20keV)
    number, // B (10-20keV)
];

export type IWindowSum = [
    number, // A  (2-20keV)
    number, // B (2-20keV)
    number, // A  (2-4keV)
    number, // B (2-4keV)
    number, // A  (4-10keV)
    number, // B (4-10keV)
    number, // A  (10-20keV)
    number, // B (10-20keV)
];

export type IRollingAverageBin = [
    number, // MJD
    number, // windowStartMJD
    number, // windowEndMJD
    number, // A  (2-20keV)
    number, // B (2-20keV)
    number, // A  (2-4keV)
    number, // B (2-4keV)
    number, // A  (4-10keV)
    number, // B (4-10keV)
    number, // A  (10-20keV)
    number, // B (10-20keV)
];

export interface IRollingAverageData {
    bins: Array<IRollingAverageBin>,
    minX: number,
    maxX: number,
    rangeX: number,
    minY: [number, number, number, number],
    maxY: [number, number, number, number],
    rangeY: [number, number, number, number],
}

export type IFont = 'Sans' | 'Serif' | 'Monospace';

export interface IPreferences {
    binSize: number,
    minMJD: number,
    maxMJD: number,
    // font: IFont,
    // scale: number,
}

export interface ITickData {
    step: number,
    stepOffset: number,
    subScale: number,
    firstSub: number,
    mainScale: number,
    firstMain: number,
}

export interface ITicks {
    step: number,
    stepOffset: number,
    sub: Array<number>,
    main: Array<number>,
}

export interface IDateTicks {
    step: number,
    stepOffset: number,
    sub: Array<Date>,
    main: Array<Date>,
    toString: (date: Date) => string,
}

export enum Mode {
    Default,
    Append,
    Range,
}

export enum Band {
    $2_20 = 0,
    $2_4 = 1,
    $4_10 = 2,
    $10_20 = 3,
}

export const BandTitles = {
    [Band.$2_20]: '2-20keV',
    [Band.$2_4]: '2-4keV',
    [Band.$4_10]: '4-10keV',
    [Band.$10_20]: '10-20keV',
};
