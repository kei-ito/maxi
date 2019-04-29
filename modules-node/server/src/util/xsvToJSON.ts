import {IXSVMapper} from '../types';

export const isNonEmptyString = (input: string) => Boolean(input.match(/\S/));

export const getNonEmptyTrimmedLinesFrom = (
    input: string,
): Array<string> => input.split(/\s*[\r\n]\s*/).filter(isNonEmptyString);

export const xsv2js = <TValue>(
    xsvTableInput: string,
    delimiter: RegExp | string,
    mapper: IXSVMapper<TValue>,
): Array<Array<TValue>> => getNonEmptyTrimmedLinesFrom(xsvTableInput).map((rowInput) => rowInput.split(delimiter).map(mapper));

export const csv2js = <TValue>(
    csvTableInput: string,
    mapper: IXSVMapper<TValue>,
) => xsv2js(csvTableInput, /\s*,\s*/, mapper);

export const ssv2js = <TValue>(
    ssvTableInput: string,
    mapper: IXSVMapper<TValue>,
) => xsv2js(ssvTableInput, /\s+/, mapper);

export const tsv2js = <TValue>(
    tsvTableInput: string,
    mapper: IXSVMapper<TValue>,
) => xsv2js(tsvTableInput, '\t', mapper);
