"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isNonEmptyString = (input) => Boolean(input.match(/\S/));
exports.getNonEmptyTrimmedLinesFrom = (input) => input.split(/\s*[\r\n]\s*/).filter(exports.isNonEmptyString);
exports.xsv2js = (xsvTableInput, delimiter, mapper) => exports.getNonEmptyTrimmedLinesFrom(xsvTableInput).map((rowInput) => rowInput.split(delimiter).map(mapper));
exports.csv2js = (csvTableInput, mapper) => exports.xsv2js(csvTableInput, /\s*,\s*/, mapper);
exports.ssv2js = (ssvTableInput, mapper) => exports.xsv2js(ssvTableInput, /\s+/, mapper);
exports.tsv2js = (tsvTableInput, mapper) => exports.xsv2js(tsvTableInput, '\t', mapper);
//# sourceMappingURL=xsvToJSON.js.map