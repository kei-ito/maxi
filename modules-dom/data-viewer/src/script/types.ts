export interface IError<TData = any> extends Error {
    code: string,
    data: TData,
}

export interface IForEachable<TValue, TKey = string | number> {
    forEach: (fn: (value: TValue, key: TKey) => void) => void,
}

export interface IResponseData {
    sourceTitle: string | null,
    sourceURL: string | null,
    createdAt: Date,
    elapsedSeconds: number,
}

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

export type IMJDRange = [number, number];
export enum PlotType {
    Point = 'point',
    Line = 'line',
}

export enum Font {
    sans = 'sans',
    serif = 'serif',
}

export interface IPreferences {
    binSize: number,
    mjdRange: IMJDRange,
    plotType: PlotType,
    font: Font,
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
    min: number,
    max: number,
    toString: (value: number) => string,
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

export enum Color {
    black = '#000000',
    red = '#ff0000',
    green = '#007f00',
    blue = '#0000ff',
}

export const BandColors = {
    [Band.$2_20]: Color.black,
    [Band.$2_4]: Color.red,
    [Band.$4_10]: Color.green,
    [Band.$10_20]: Color.blue,
};

export interface IRect {
    left: number,
    right: number,
    top: number,
    bottom: number,
    width: number,
    height: number,
}

export interface IMargin {
    left: number,
    right: number,
    top: number,
    bottom: number,
    gap: number,
    lineHeight: number,
}
