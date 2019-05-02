import {getMatchedStrings} from './getMatchedStrings';

export const parseTableCellHTML = (
    tableCellHTML: string,
): string => tableCellHTML.trim();

export const parseTableRowHTML = (
    tableRowHTML: string,
): Array<string> => getMatchedStrings(tableRowHTML, /<t[dh][^>]*?>([\s\S]*?)<\/t[dh]/gi).map(parseTableCellHTML);

export const parseTableHTML = (
    tableHTML: string,
): Array<Array<string>> => getMatchedStrings(tableHTML, /<tr[^>]*?>([\s\S]*?)<\/tr/gi).map(parseTableRowHTML);

export const getTableFromHTML = (
    html: string,
): Array<Array<Array<string>>> => getMatchedStrings(html, /<table[^>]*?>([\s\S]*?)<\/table/gi).map(parseTableHTML);
