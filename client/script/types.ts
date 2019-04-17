export interface IError<TData> extends Error {
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

export type IMAXIObjectBin = [
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
];

export type IMAXIObjectData = Array<IMAXIObjectBin>;

export type IFont = 'Sans' | 'Serif' | 'Monospace';

export const AvailableFonts: Array<IFont> = ['Serif', 'Sans', 'Monospace'];

export interface IPreferences {
    font: IFont,
}

export const getDefaultPreferences = (): IPreferences => ({
    font: 'Serif',
});

export enum Modes {
    Default,
    Append,
    Range,
};
