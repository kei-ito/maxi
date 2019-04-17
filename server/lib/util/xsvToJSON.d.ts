import { IXSVMapper } from '../types';
export declare const isNonEmptyString: (input: string) => boolean;
export declare const getNonEmptyTrimmedLinesFrom: (input: string) => string[];
export declare const xsv2js: <TValue>(xsvTableInput: string, delimiter: string | RegExp, mapper: IXSVMapper<TValue>) => TValue[][];
export declare const csv2js: <TValue>(csvTableInput: string, mapper: IXSVMapper<TValue>) => TValue[][];
export declare const ssv2js: <TValue>(ssvTableInput: string, mapper: IXSVMapper<TValue>) => TValue[][];
export declare const tsv2js: <TValue>(tsvTableInput: string, mapper: IXSVMapper<TValue>) => TValue[][];
