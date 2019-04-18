export interface IError<TData = any> extends Error {
    code: string,
    data: TData,
}

export type IMAXIObjectSource = [
    string,
    string,
    string,
    string,
    string,
    string,
    string,
];

export interface IMAXIObject {
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

export type IMAXILightCurveBin = [
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

export type IMAXILightCurveData = Array<IMAXILightCurveBin>;

export interface IMAXIBinnedLightCurveData {
    bins: IMAXILightCurveData,
    minX: number,
    maxX: number,
    rangeX: number,
    minY: number,
    maxY: number,
    rangeY: number,
}

export type IFont = 'Sans' | 'Serif' | 'Monospace';

export interface IPreferences {
    binSize: number,
    font: IFont,
    scale: number,
}

export enum Modes {
    Default,
    Append,
    Range,
};
